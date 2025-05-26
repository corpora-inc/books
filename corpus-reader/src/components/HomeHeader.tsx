import { BookOpenIcon, ClockIcon, HomeIcon, PlusIcon } from "lucide-react";
import { Button } from "./ui/button";

import BookSearchDialog from "./BookSearchDialog";
import { BookEntry } from "@/lib/utils";

const HomeHeader = ({
  books,
  handleAddBookToLibrary,
}: {
  books: BookEntry[];
  handleAddBookToLibrary: () => Promise<void>;
}) => {
  return (
    <div className="bg-background/60 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center md:hidden">
          <BookOpenIcon className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-xl font-bold">Corpus Reader</h1>
        </div>

        <div className="hidden md:block">
          <Button variant="ghost" size="sm" className="mr-1">
            <HomeIcon className="h-4 w-4 mr-2" />
            Home
          </Button>
          <Button variant="ghost" size="sm" className="mr-1">
            <BookOpenIcon className="h-4 w-4 mr-2" />
            Library
          </Button>
          <Button variant="ghost" size="sm">
            <ClockIcon className="h-4 w-4 mr-2" />
            Recent
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          {/* Search Dialog with debounce */}
          <BookSearchDialog books={books} />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:hidden"
            onClick={handleAddBookToLibrary}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeHeader;
