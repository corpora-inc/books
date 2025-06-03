import { List, ChevronRight } from "lucide-react";
import { Button } from "@/components//ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define a TocItem type that supports nested subitems
interface TocItem {
  label?: string;
  href?: string;
  subitems?: TocItem[];
}

const TableOfContents = ({
  currentTheme,
  goToLocation,
  toc,
}: {
  currentTheme: { className: string };
  goToLocation: (location: string) => void;
  toc: TocItem[];
}) => {
  return (
    <Sheet>
      <SheetTrigger>
        <div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Table of Contents"
            title="Table of Contents"
          >
            <List className="w-5 h-5" />
          </Button>
        </div>
      </SheetTrigger>
      <SheetContent side="left" className={cn(currentTheme.className)}>
        <SheetHeader>
          <SheetTitle>Table of Contents</SheetTitle>
          <div className="flex flex-col ">
            <ScrollArea className="flex-1 !max-h-screen">
              <nav className="">
                {toc.length === 0 ? (
                  <p className="p-4 text-sm text-slate-500">
                    No table of contents available
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {toc.map((item, index) => (
                      <li key={index}>
                        {/* First level item */}
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-sm h-auto py-2 px-3 font-normal"
                          onClick={() => goToLocation(item.href || "")}
                        >
                          <span className="truncate">
                            {item.label || "Unknown"}
                          </span>
                        </Button>
                        
                        {/* Second level items (if any) */}
                        {item.subitems && item.subitems.length > 0 && (
                          <ul className="ml-4 space-y-1 mt-1">
                            {item.subitems.map((subitem, subIndex) => (
                              <li key={`${index}-${subIndex}`}>
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start text-sm h-auto py-1 px-3 font-normal"
                                  onClick={() => goToLocation(subitem.href || "")}
                                >
                                  <ChevronRight className="w-3 h-3 mr-1 opacity-70" />
                                  <span className="truncate">
                                    {subitem.label || "Unknown"}
                                  </span>
                                </Button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </nav>
            </ScrollArea>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default TableOfContents;
