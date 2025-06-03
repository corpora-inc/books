import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Book, Rendition } from "epubjs";
import { cn, readFileFromPath } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Settings,
  ArrowLeft,
  X,
} from "lucide-react";

import TableOfContents from "./epubReader/Toc";
import SettingsDrawer from "./epubReader/SettingsDrawer";
interface Theme {
  name: string;
  backgroundColor: string;
  color: string;
  className: string;
}

const THEMES: Theme[] = [
  {
    name: "Light",
    backgroundColor: "#ffffff",
    color: "#1a1a1a",
    className: "bg-white text-slate-900",
  },
  {
    name: "Sepia",
    backgroundColor: "#f8f2e8",
    color: "#5f4b32",
    className: "bg-amber-50 text-amber-900",
  },
  {
    name: "Dark",
    backgroundColor: "#1a1a1a",
    color: "#e6e6e6",
    className: "bg-slate-900 text-slate-200",
  },
  {
    name: "Night",
    backgroundColor: "#0f172a",
    color: "#cbd5e1",
    className: "bg-slate-950 text-slate-300",
  },
];

const FONT_SIZES = [12, 14, 16, 18, 20, 22, 24, 26, 28];
const FONT_FAMILIES = [
  { name: "Sans-serif", value: '"Inter", system-ui, sans-serif' },
  { name: "Serif", value: '"Georgia", "Times New Roman", serif' },
  { name: "Mono", value: '"JetBrains Mono", monospace' },
];

const EpubReader = () => {
  const { bookPath } = useParams<{ bookPath: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [rendition, setRendition] = useState<Rendition | null>(null);
  // Track current location for bookmarks and progress
  const [currentCfi, setCurrentCfi] = useState<string>("");
  const [bookProgress, setBookProgress] = useState<number>(0);
  const [toc, setToc] = useState<any[]>([]);
  const [metadata, setMetadata] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tocOpen, setTocOpen] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [fontSize, setFontSize] = useState<number>(18);
  const [fontFamily, setFontFamily] = useState<string>(FONT_FAMILIES[0].value);
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES[0]);
  const [error, setError] = useState<string>("");
  const viewerRef = useRef<HTMLDivElement>(null);

  // Load book from path
  useEffect(() => {
    const loadBook = async () => {
      if (!bookPath) {
        setError("No book path provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const bookInstance = await readFileFromPath(bookPath);
        setBook(bookInstance);

        // Get metadata
        const metadata = await bookInstance.loaded.metadata;
        setMetadata(metadata);

        // Get table of contents
        const navigation = await bookInstance.loaded.navigation;
        if (navigation && navigation.toc) {
          // Process TOC to ensure it's structured with up to 2 levels deep
          const processedToc = navigation.toc.map((item: any) => {
            // Process first level item
            const firstLevelItem = {
              label: item.label,
              href: item.href,
              subitems: []
            };
            
            // Process second level items if they exist
            if (item.subitems && Array.isArray(item.subitems)) {
              firstLevelItem.subitems = item.subitems.map((subitem: any) => ({
                label: subitem.label,
                href: subitem.href
              }));
            }
            
            return firstLevelItem;
          });
          
          setToc(processedToc);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error loading book:", err);
        setError(
          `Error loading book: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
        setIsLoading(false);
      }
    };

    loadBook();

    // Cleanup function
    return () => {
      if (book) {
        book.destroy();
      }
    };
  }, [bookPath]);

  // Initialize rendition when book is loaded and viewerRef is available
  useEffect(() => {
    if (book && viewerRef.current) {
      const viewer = viewerRef.current;
      const viewerWidth = viewer.clientWidth;
      const viewerHeight = viewer.clientHeight;

      // Create rendition
      const renditionInstance = book.renderTo(viewer, {
          manager: "continuous",
        width: viewerWidth,
        height: viewerHeight,
        spread: "none",
        flow: "paginated",
         snap: true
      });

      // Apply initial theme and font settings
      renditionInstance.themes.register("default", {
        body: {
          "font-family": fontFamily,
          "font-size": `${fontSize}px`,
          color: currentTheme.color,
          background: currentTheme.backgroundColor,
        },
      });
      renditionInstance.themes.select("default");

      // Display the first page
      renditionInstance.display();

      // Set current location when page changes
      renditionInstance.on("locationChanged", (location: any) => {
        setCurrentCfi(location.start.cfi);

        // Calculate reading progress
        if (location && location.start && location.start.percentage) {
          setBookProgress(Math.floor(location.start.percentage * 100));
        }
      });

      // Handle keyboard navigation
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === "ArrowRight") {
          renditionInstance.next();
        } else if (e.key === "ArrowLeft") {
          renditionInstance.prev();
        }
      };

      document.addEventListener("keydown", handleKeyPress);

      // Handle resize
      const handleResize = () => {
        if (renditionInstance && viewer) {
          renditionInstance.resize(viewer.clientWidth, viewer.clientHeight);
        }
      };

      window.addEventListener("resize", handleResize);

      // Store rendition
      setRendition(renditionInstance);

      // Return cleanup function
      return () => {
        document.removeEventListener("keydown", handleKeyPress);
        window.removeEventListener("resize", handleResize);
        if (renditionInstance) {
          renditionInstance.destroy();
        }
      };
    }
  }, [book, viewerRef, fontSize, fontFamily, currentTheme]);

  // Update theme and font settings when changed
  useEffect(() => {
    if (rendition) {
      rendition.themes.register("default", {
        body: {
          "font-family": fontFamily,
          "font-size": `${fontSize}px`,
          color: currentTheme.color,
          background: currentTheme.backgroundColor,
        },
      });
      rendition.themes.select("default");
    }
  }, [rendition, fontSize, fontFamily, currentTheme]);

  // Search function - basic implementation for EPUB.js
  const handleSearch = async () => {
    if (!book || !searchQuery.trim()) return;

    setSearchResults([]);

    try {
      // Simplified search implementation that works with different EPUB.js versions
      const results: any[] = [];

      // Get all spine items from the book
      if (book.spine) {
        // EPUB.js types can vary by version - use type assertions for compatibility
        const spine = book.spine as any;
        const spineItems = spine.items || spine.spineItems || [];

        for (let i = 0; i < spineItems.length; i++) {
          try {
            const item = spineItems[i];
            // Load content - different EPUB.js versions handle this differently
            let content = "";
            let cfi = "";

            if (typeof item.load === "function") {
              const text = await item.load(book.archive);
              const doc = new DOMParser().parseFromString(text, "text/html");
              content = doc.body.textContent || "";
              cfi = item.cfiBase || "";
            } else if (item.href) {
              // Alternative approach for different EPUB.js versions
              cfi = book.section(item.href)?.cfiBase || "";
              // Use rendition to get content if possible
              if (rendition) {
                try {
                  // EPUB.js types can vary - convert with unknown as intermediate step
                  const doc =
                    (await rendition.getContents()) as unknown as any[];
                  if (doc && Array.isArray(doc) && doc.length > 0) {
                    const contentDoc = doc[0].document || doc[0];
                    if (contentDoc && contentDoc.body) {
                      content = contentDoc.body.textContent || "";
                    }
                  }
                } catch (err) {
                  console.warn("Error getting content:", err);
                }
              }
            }

            if (
              content &&
              content.toLowerCase().includes(searchQuery.toLowerCase())
            ) {
              results.push({
                cfi: cfi,
                excerpt: `${content.substring(0, 100).trim()}...`,
              });
            }
          } catch (e) {
            console.warn("Error searching in item:", e);
          }
        }
      }

      setSearchResults(results);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  // Navigation functions
  const goToLocation = (href: string) => {
    if (rendition) {
      try {
        rendition.display(href);
        setTocOpen(false);
        setSearchOpen(false);
      } catch (err) {
        console.error("Navigation error:", err);
      }
    }
  };

  // Add bookmark at current location
  const addBookmark = () => {
    if (currentCfi) {
      // In a complete implementation, you would save this to localStorage or your app's state
      console.log("Bookmark added at location:", currentCfi);
      // Example placeholder for bookmark functionality
      // const newBookmark = { cfi: currentCfi, text: 'Bookmark', timestamp: new Date() };
      // setBookmarks([...bookmarks, newBookmark]);
    }
  };

  // Go to beginning of book - used in UI below

  const nextPage = () => rendition?.next();
  const prevPage = () => rendition?.prev();

  // Render loading state
  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="w-24 h-24 mb-4 animate-spin rounded-full border-t-4 border-primary"></div>
        <h3 className="text-lg font-medium">Loading book...</h3>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-md text-center">
          <div className="p-2 w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto mb-4 flex items-center justify-center">
            <X size={24} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Failed to load book</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
          <Button variant="default" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("h-screen flex flex-col", currentTheme.className)}>
      {/* Top toolbar */}
      <header className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.history.back()}
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <h1 className="font-medium text-sm md:text-base truncate max-w-[150px] md:max-w-[300px]">
            {metadata?.title || "Untitled Book"}
          </h1>
        </div>

        <div className="flex items-center gap-1">
          {/* Basic button controls - in a complete implementation, use proper tooltips */}

          <TableOfContents
            currentTheme={currentTheme}
            goToLocation={goToLocation}
            toc={toc}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSettingsOpen(!settingsOpen)}
            aria-label="Settings"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={addBookmark}
            aria-label="Add Bookmark"
            title="Add Bookmark"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-bookmark"
            >
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
            </svg>
          </Button>
        </div>
      </header>

      {/* Main content area with sidebars */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Table of contents sidebar */}
        <aside
          className={cn(
            "absolute inset-y-0 left-0 w-64 md:w-72 lg:w-80 border-r z-10 transition-transform duration-300 ease-in-out transform",
            currentTheme.className,
            tocOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold">Table of Contents</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTocOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <nav className="p-2">
                {toc.length === 0 ? (
                  <p className="p-4 text-sm text-slate-500">
                    No table of contents available
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {toc.map((item, index) => (
                      <li key={index}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-sm h-auto py-2 px-3 font-normal"
                          onClick={() => goToLocation(item.href || "")}
                        >
                          <span className="truncate">
                            {item.label || "Unknown"}
                          </span>
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </nav>
            </ScrollArea>
          </div>
        </aside>

        {/* Search sidebar */}
        <aside
          className={cn(
            "absolute inset-y-0 right-0 w-64 md:w-72 lg:w-80 border-l z-10 transition-transform duration-300 ease-in-out transform",
            currentTheme.className,
            searchOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold">Search</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-4 border-b">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search in book..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2">
                {searchResults.length === 0 ? (
                  <p className="p-4 text-sm text-slate-500">
                    {searchQuery.trim()
                      ? "No results found"
                      : "Enter a search term"}
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {searchResults.map((result, index) => (
                      <li key={index}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-sm h-auto py-2 px-3 font-normal"
                          onClick={() =>
                            result.cfi ? goToLocation(result.cfi) : null
                          }
                        >
                          <span className="truncate">
                            {result.excerpt || "Matching content"}
                          </span>
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </ScrollArea>
          </div>
        </aside>

        {/* Settings drawer (bottom) */}
        <SettingsDrawer
          FONT_FAMILIES={FONT_FAMILIES}
          FONT_SIZES={FONT_SIZES}
          fontSize={fontSize}
          setFontSize={setFontSize}
          fontFamily={fontFamily}
          setFontFamily={setFontFamily}
          currentTheme={currentTheme}
          setCurrentTheme={setCurrentTheme}
          settingsOpen={settingsOpen}
          setSettingsOpen={setSettingsOpen}
          THEMES={THEMES}
        />

        {/* EPUB viewer */}
        <main
          className="flex-1 overflow-hidden"
          onClick={(e) => {
            // Detect click zones for navigation
            if (!rendition) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const width = rect.width;

            // Left 1/3 of screen - previous page
            if (x < width / 3) {
              prevPage();
            }
            // Right 1/3 of screen - next page
            else if (x > (2 * width) / 3) {
              nextPage();
            }
            // Middle - toggle UI
            // This would toggle UI if we had a full-screen mode
          }}
        >
          <div ref={viewerRef} className="w-full h-full" />
        </main>
      </div>

      {/* Bottom toolbar */}
      <footer className="flex items-center justify-between px-4 py-2 border-t">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (rendition) {
                try {
                  rendition.display(0);
                } catch (e) {
                  console.warn("Error going to beginning:", e);
                }
              }
            }}
            aria-label="Go to Beginning"
            title="Go to Beginning"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 20V4M6 20l8-8-8-8" />
            </svg>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={prevPage}
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <Progress value={bookProgress} className="w-24 md:w-32 h-2" />

          <Button
            variant="ghost"
            size="icon"
            onClick={nextPage}
            aria-label="Next Page"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        <div className="text-xs">
          {bookProgress > 0 ? `${bookProgress}%` : ""}
        </div>
      </footer>
    </div>
  );
};

export default EpubReader;
