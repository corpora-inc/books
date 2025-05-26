import { useLoadImage } from "@/lib/hooks/useLoadImage";
import { BookEntry } from "@/lib/utils";
import { BookIcon, EyeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BookCard = ({
  book,
  kind,
}: {
  book: BookEntry;
  kind: "card" | "list";
}) => {
  const navigate = useNavigate();
  const { imageUrl, isLoading, error } = useLoadImage(book.cover_path);

  const handleBookClick = (bookPath: string) => {
    navigate(`/reader/${encodeURIComponent(bookPath)}`);
  };

  if (kind === "card") {
    return (
  <div
  className="flex-shrink-0 w-32 snap-start group cursor-pointer transition-all duration-200 hover:scale-105"
  onClick={() => handleBookClick(book.path)}
>
  <div className="relative aspect-[2/3] mb-3 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all">
    {imageUrl? (
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
    
    {/* Reading progress indicator */}
    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-background/40 backdrop-blur-sm">
      <div
        className="h-full bg-primary transition-all duration-300"
        style={{ width: `${book.progress || 0}%` }}
      ></div>
    </div>
    
    {/* Finished badge */}
    {book.is_finished && (
      <div className="absolute top-1 right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    )}
    
    {/* Language badge */}
    {book.lang && (
      <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-background/70 backdrop-blur-sm rounded text-[10px] font-medium uppercase">
        {book.lang}
      </div>
    )}
    
    {/* Hover overlay effect */}
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200"></div>
  </div>
  
  <div className="space-y-0.5">
    <p className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
      {book.title || "Untitled Book"}
    </p>
    <p className="text-xs text-muted-foreground line-clamp-1">
      {book.author || "Unknown Author"}
    </p>
    
    {/* Rating stars */}
    {book.rating > 0 && (
      <div className="flex items-center mt-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg 
            key={star}
            className={`w-2.5 h-2.5 ${star <= book.rating ? "text-amber-400" : "text-muted-foreground/30"}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )}
    
    {/* Progress indicator */}
    <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
      {book.progress > 0 ? (
        <div className="flex items-center">
          <span className="font-medium">{Math.round(book.progress)}%</span>
          <span className="ml-1">{book.is_finished ? "completed" : "read"}</span>
        </div>
      ) : book.last_read ? (
        <span className="text-xs text-muted-foreground/70">
          Added {new Date(book.added_to_library_at).toLocaleDateString()}
        </span>
      ) : (
        <span className="text-xs text-muted-foreground/70">Not started</span>
      )}
    </div>
  </div>
</div>
    );
  } else if (kind === "list") {
    return (
    <div
      className="group flex items-center p-2 rounded-lg hover:bg-muted/20 active:bg-muted transition-all duration-200 cursor-pointer border border-border/40 hover:border-border/80 shadow-sm hover:shadow"
      onClick={() => handleBookClick(book.path)}
    >
      <div className="relative h-20 w-14 mr-4 flex-shrink-0 overflow-hidden rounded-md shadow-sm group-hover:shadow transition-all">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${book.title || "Book"} cover`}
            className="absolute inset-0 w-full h-full object-cover object-center shadow-sm"
            style={{ objectPosition: 'left' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/80 to-muted/50">
            <BookIcon className="w-8 h-8 text-muted-foreground opacity-80" />
          </div>
        )}
        
        {/* Reading progress indicator - vertical */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-background/30 backdrop-blur-sm">
          <div
            className="w-full bg-primary transition-all duration-300"
            style={{ height: `${book.progress || 0}%` }}
          ></div>
        </div>
        
        {book.is_finished && (
          <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-bl-md flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3 className="font-medium text-base line-clamp-1 group-hover:text-primary transition-colors">
            {book.title || "Untitled Book"}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {book.author || "Unknown Author"}
            {book.publisher && ` · ${book.publisher}`}
          </p>
        </div>
        
        <div className="flex items-center mt-1.5 text-xs text-muted-foreground">
          {book.last_read && (
            <span className="border-r border-border/60 pr-2 mr-2">
              Last read: {new Date(book.last_read).toLocaleDateString()}
            </span>
          )}
          {book.rating > 0 && (
            <div className="flex items-center mr-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg 
                  key={star}
                  className={`w-3 h-3 ${star <= book.rating ? "text-amber-400" : "text-muted-foreground/30"}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          )}
          <div className="flex items-center ml-auto">
            <EyeIcon className="w-3.5 h-3.5 text-primary/80 mr-1.5" />
            <span className="font-medium">{Math.round(book.progress || 0)}%</span>
            <span className="ml-1">{book.is_finished ? "completed" : "in progress"}</span>
          </div>
        </div>
      </div>
    </div>
    );
  }
};

export default BookCard;
