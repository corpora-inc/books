import { List, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
        <Button
          variant="ghost"
          size="icon"
          aria-label="Table of Contents"
          title="Table of Contents"
        >
          <List className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className={cn(currentTheme.className)}>
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold text-primary">
            Table of Contents
          </SheetTitle>
          <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
            <nav className="space-y-2">
              {toc.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">
                  No table of contents available
                </p>
              ) : (
                <ul className="space-y-1">
                  {toc.map((item, index) => (
                    <li key={index}>
                      <Collapsible>
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-between text-sm font-medium text-left h-auto py-2 px-3 hover:bg-accent"
                          >
                            <span className="truncate">
                              {item.label || "Unknown"}
                            </span>
                            {item.subitems && item.subitems.length > 0 && (
                              <ChevronDown className="w-4 h-4 ml-2 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                        {item.subitems && item.subitems.length > 0 && (
                          <CollapsibleContent>
                            <ul className="ml-4 space-y-1 mt-1">
                              {item.subitems.map((subitem, subIndex) => (
                                <li key={`${index}-${subIndex}`}>
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start text-sm h-auto py-1 px-3 text-muted-foreground hover:text-primary hover:bg-accent"
                                    onClick={() =>
                                      goToLocation(subitem.href || "")
                                    }
                                  >
                                    <ChevronRight className="w-3 h-3 mr-1 opacity-70" />
                                    <span className="truncate">
                                      {subitem.label || "Unknown"}
                                    </span>
                                  </Button>
                                </li>
                              ))}
                            </ul>
                          </CollapsibleContent>
                        )}
                      </Collapsible>
                    </li>
                  ))}
                </ul>
              )}
            </nav>
          </ScrollArea>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default TableOfContents;