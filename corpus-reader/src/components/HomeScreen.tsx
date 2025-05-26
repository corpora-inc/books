import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";
import { BookEntry } from "@/lib/utils";
import BookCard from "./BookCard";
import EmptyLibrary from "./EmptyLibrary";
import { LayoutDashboardIcon, ListIcon, PlusIcon } from "lucide-react";

import FeaturedBookCard from "./FeaturedBookCard";
import HomeHeader from "./HomeHeader";
import HomeSidebar from "./Sidebar";
import Loader from "./Loader";
import { invoke } from "@tauri-apps/api/core";

interface HomeScreenProps {
  books: BookEntry[];
  onBookAdded?: () => void;
}

export function HomeScreen({ books, onBookAdded }: HomeScreenProps) {
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [loadingBooks, setLoadingBooks] = useState(false);
  // TODO: should get the last readed book.
  const featuredBook = books.length > 0 ? books[0] : null;
  const continueReadingBooks = books.slice(0, 4);

  const handleAddBookToLibrary = async () => {
    try {
      setLoadingBooks(true);
      await invoke("pick_file");
      onBookAdded!();
    } catch (error) {
      console.error("Error opening file dialog or adding book:", error);
      toast.error("Could not open or process the EPUB file.");
    } finally {
      setLoadingBooks(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <HomeSidebar handleAddBookToLibrary={handleAddBookToLibrary} />
        {/* Main Content */}
        <div className="flex-1 md:ml-64">
          {/* Top Navigation Bar */}
          <HomeHeader
            books={books}
            handleAddBookToLibrary={handleAddBookToLibrary}
          />
          {/* Content Area */}
          <div className="container px-4 py-6 mx-auto">
            {books.length === 0 ? (
              <>
                {loadingBooks ? (
                  <Loader text="loading book..." />
                ) : (
                  <EmptyLibrary
                    handleAddBookToLibrary={handleAddBookToLibrary}
                  />
                )}
              </>
            ) : (
              <div className="w-full space-y-8">
                {/* Featured Book - Current Read */}
                {featuredBook && <FeaturedBookCard book={featuredBook} />}

                {/* Recently Added Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-foreground">
                      Continue reading
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {continueReadingBooks.map((book) => (
                      <BookCard key={book.id} book={book} kind="list" />
                    ))}
                  </div>
                </div>

                {/* Library Section */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-3 sm:space-y-0">
                    <h2 className="text-xl font-bold text-foreground">
                      Your library
                    </h2>

                    <div className="flex flex-wrap items-center gap-2">
                      <Tabs
                        value={viewMode}
                        onValueChange={(value) =>
                          setViewMode(value as "card" | "list")
                        }
                        className="w-auto"
                      >
                        <TabsList className="h-8 px-1">
                          <TabsTrigger value="card" className="h-6 w-7 px-0">
                            <LayoutDashboardIcon className="w-4 h-4" />
                          </TabsTrigger>
                          <TabsTrigger value="list" className="h-6 w-7 px-0">
                            <ListIcon className="w-4 h-4" />
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    {viewMode === "list" && (
                      <div className="space-y-2">
                        {books.map((book) => (
                          <BookCard key={book.id} book={book} kind="list" />
                        ))}
                      </div>
                    )}
                    {viewMode === "card" && (
                      <div className="flex flex-wrap gap-2">
                        {books.map((book) => (
                          <BookCard key={book.id} book={book} kind="card" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating action button for mobile */}
      <div className="fixed right-4 bottom-4 z-10 md:hidden">
        <Button
          onClick={handleAddBookToLibrary}
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <PlusIcon className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
