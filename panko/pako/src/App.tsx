import { useState, useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";
import { speakKO, speakEN } from "./util/speak";
import {
  ChevronLeft as ChevronLeftIcon,
  RefreshCw as RefreshIcon,
  ChevronRight as ChevronRightIcon,
  Info,
} from "lucide-react";
import "./index.css";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import About from "./components/About";

const HISTORY_KEY = "korean_sentence_history";

export type Sentence = {
  text_korean: string;
  text_english: string;
};

export default function App() {
  const [history, setHistory] = useState<Sentence[]>([]);
  const [index, setIndex] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(true);

  const indexRef = useRef<number>(index);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  // Initial load: localStorage or fetch
  useEffect(() => {
    (async () => {
      try {
        const raw = localStorage.getItem(HISTORY_KEY);
        if (raw) {
          try {
            const arr: Sentence[] = JSON.parse(raw);
            if (arr.length) {
              setHistory(arr);
              setIndex(arr.length - 1);
              return;
            }
          } catch {
            // ignore invalid JSON
          }
        }
        const s = await invoke<Sentence>("get_random_sentence");
        setHistory([s]);
        setIndex(0);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Persist history
  useEffect(() => {
    if (history.length) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }
  }, [history]);

  // Fetch new sentence
  const fetchRandomSentence = async () => {
    setLoading(true);
    try {
      const s = await invoke<Sentence>("get_random_sentence");
      setHistory(prev => {
        const truncated = prev.slice(0, indexRef.current + 1);
        return [...truncated, s];
      });
      setIndex(() => indexRef.current + 1);
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => index > 0 && setIndex(i => i - 1);
  const handleNext = () =>
    index < history.length - 1 ? setIndex(i => i + 1) : fetchRandomSentence();

  const curr = history[index];

  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-50">
      {/* About Drawer */}
      <Drawer>
        <DrawerTrigger asChild>
          <div>
            <Info className="absolute top-5 right-5 w-7 h-7 text-gray-500" />
          </div>
        </DrawerTrigger>
        <DrawerContent className="max-w-3xl w-full mx-auto shadow-lg">
          <div className="max-h-[80vh] overflow-y-auto">
            <DrawerHeader>
              <DrawerTitle className="font-bold text-2xl">
                About Pako
              </DrawerTitle>
              <DrawerDescription>Learn Korean or 영어를 배우다</DrawerDescription>
            </DrawerHeader>
            <About />
          </div>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <div className="flex flex-col h-full w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Centered content wrapper */}
        <div className="my-auto flex flex-col items-center justify-center space-y-4 px-4">
          {loading ? (
            <p>Loading…</p>
          ) : curr ? (
            <>
              <p className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-center">
                {curr.text_korean}
              </p>
              <Button
                onClick={() => speakKO(curr.text_korean)}
                size="lg"
                variant="outline"
                className="mb-10"
              >
                Speak Korean
              </Button>

              <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-700 text-center mt-10">
                {curr.text_english}
              </p>
              <Button
                onClick={() => speakEN(curr.text_english)}
                size="lg"
                variant="outline"
              >
                Speak English
              </Button>
            </>
          ) : (
            <p>No sentence available.</p>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="bg-gray-100 border-t">
          <div className="flex justify-between items-center p-4">
            <Button
              onClick={handlePrev}
              disabled={loading || index <= 0}
              className="p-2"
              variant="outline"
              aria-label="Previous sentence"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </Button>

            <Button
              onClick={fetchRandomSentence}
              disabled={loading}
              className="p-2"
              variant="outline"
              aria-label="Random sentence"
            >
              <RefreshIcon className="w-6 h-6" />
            </Button>

            <Button
              onClick={handleNext}
              disabled={loading}
              className="p-2"
              variant="outline"
              aria-label="Next sentence"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
