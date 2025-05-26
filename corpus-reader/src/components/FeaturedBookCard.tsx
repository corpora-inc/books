import { useLoadImage } from "@/lib/hooks/useLoadImage";
import { Button } from "./ui/button";
import { BookEntry } from "@/lib/utils";
import { BookIcon } from "lucide-react";

const FeaturedBookCard = ({ book }: { book: BookEntry }) => {
  const { imageUrl, isLoading, error } = useLoadImage(book.cover_path);
  return (
    <div className="overflow-hidden border shadow-md rounded-sm">
      <div className="flex flex-col md:flex-row">
        <div className="relative w-full md:w-1/3 h-[200px] md:h-auto">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent md:bg-gradient-to-r z-10"></div>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${book.title || "Book"} cover`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/70">
              <BookIcon className="w-12 h-12 text-muted-foreground opacity-80" />
            </div>
          )}
        </div>
        <Button className="!rounded-none w-full md:w-auto">
          Continue Reading
        </Button>
      </div>
    </div>
  );
};
export default FeaturedBookCard;
