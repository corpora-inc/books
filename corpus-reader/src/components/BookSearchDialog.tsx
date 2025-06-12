import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { BookEntry } from "@/lib/utils";
import BookCard from "./BookCard";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";

const BookSearchDialog = ({ books }: { books: BookEntry[] }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookEntry[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (query.trim() === "") {
        setResults([]);
        return;
      }
      const filtered = books.filter((book) =>
        book.title.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }, 300); // 300ms debounce
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, books]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <SearchIcon className="h-4 w-4" />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex flex-col gap-4 py-4">
          <Input
            placeholder="Search book title"
            id="book-title"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="col-span-3"
            autoFocus
          />
          <div>
            {query && results.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No books found.
              </div>
            )}
            {results.length > 0 &&
              results.map((result) => (
                <BookCard key={result.id} book={result} kind="list" />
              ))}
          </div>
        </div>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
};

export default BookSearchDialog;
