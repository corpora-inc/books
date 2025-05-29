import {
  BookmarkIcon,
  BookOpenIcon,
  ClockIcon,
  HomeIcon,
  PlusIcon,
} from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";

const HomeSidebar = ({
  handleAddBookToLibrary,
}: {
  handleAddBookToLibrary: () => Promise<void>;
}) => {
  return (
    <div className="hidden md:flex w-64 flex-col fixed inset-y-0 bg-card shadow-md z-10 border-r">
      <div className="flex items-center h-16 px-6 border-b">
        <BookOpenIcon className="h-6 w-6 text-primary mr-2" />
        <h1 className="text-xl font-bold">Corpus Reader</h1>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start pl-2"
            size="sm"
          >
            <HomeIcon className="h-4 w-4 mr-3" />
            Home
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start pl-2"
            size="sm"
          >
            <BookOpenIcon className="h-4 w-4 mr-3" />
            My Library
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start pl-2"
            size="sm"
          >
            <ClockIcon className="h-4 w-4 mr-3" />
            Recent Reads
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start pl-2"
            size="sm"
          >
            <BookmarkIcon className="h-4 w-4 mr-3" />
            Bookmarks
          </Button>
        </nav>
      </ScrollArea>

      <div className="p-4 border-t">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleAddBookToLibrary}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Book
        </Button>
      </div>
    </div>
  );
};

export default HomeSidebar;
