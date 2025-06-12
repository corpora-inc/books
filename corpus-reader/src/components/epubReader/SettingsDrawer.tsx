import { Moon, Sun, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const SettingsDrawer = ({
  settingsOpen,
  setSettingsOpen,
  currentTheme,
  setCurrentTheme,
  fontSize,
  setFontSize,
  fontFamily,
  setFontFamily,
  FONT_FAMILIES,
  FONT_SIZES,
  THEMES,
}: {
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  currentTheme: { className: string; name: string };
  setCurrentTheme: React.Dispatch<React.SetStateAction<any>>
  fontSize: number;
  setFontSize: (size: number) => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  FONT_FAMILIES: { name: string; value: string }[];
  FONT_SIZES: number[];
  THEMES: { name: string; className: string }[];
}) => {
  return (
    <Drawer open={settingsOpen} onOpenChange={setSettingsOpen}>
      <DrawerContent className={cn(currentTheme.className)}>
        <DrawerHeader>
          <DrawerTitle>Reader Settings</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 pt-0">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Theme</h3>
              <div className="flex gap-2">
                {THEMES.map((theme) => (
                  <button
                    key={theme.name}
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center border-2",
                      theme.className,
                      currentTheme.name === theme.name
                        ? "border-primary"
                        : "border-transparent"
                    )}
                    onClick={() => setCurrentTheme(theme)}
                    aria-label={`${theme.name} theme`}
                  >
                    {currentTheme.name === theme.name &&
                      (theme.name === "Dark" || theme.name === "Night" ? (
                        <Moon className="w-4 h-4" />
                      ) : (
                        <Sun className="w-4 h-4" />
                      ))}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Font Size</h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() =>
                      setFontSize(Math.max(fontSize - 2, FONT_SIZES[0]))
                    }
                    disabled={fontSize <= FONT_SIZES[0]}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-sm min-w-8 text-center">
                    {fontSize}px
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() =>
                      setFontSize(
                        Math.min(
                          fontSize + 2,
                          FONT_SIZES[FONT_SIZES.length - 1]
                        )
                      )
                    }
                    disabled={fontSize >= FONT_SIZES[FONT_SIZES.length - 1]}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Slider
                value={[fontSize]}
                min={FONT_SIZES[0]}
                max={FONT_SIZES[FONT_SIZES.length - 1]}
                step={2}
                onValueChange={(value) => setFontSize(value[0])}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Font Style</h3>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a font" />
                </SelectTrigger>
                <SelectContent>
                  {FONT_FAMILIES.map((font) => (
                    <SelectItem key={font.name} value={font.value}>
                      {font.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};


export default SettingsDrawer;