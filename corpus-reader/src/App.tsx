import { useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { HomeScreen } from "@/components/HomeScreen";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { BookEntry, getLibrary } from "./lib/utils";
import EpubReader from "./components/EpubReader";
import Loader from "./components/Loader";

function App() {
  const [Books, setBooks] = useState<BookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const books = await getLibrary();
      setBooks(books);
    } catch (err) {
      toast.error("Failed to load recent books.");
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  if (isLoading && Books.length === 0) {
    return <Loader text="Loading book..." />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
          <Route
            path="/"
            element={
              <HomeScreen books={Books} onBookAdded={fetchBooks} />
            }
          />
          <Route path="/reader/:bookPath" element={<EpubReader />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Toaster richColors />
      </div>
    </Router>
  );
}

export default App;
