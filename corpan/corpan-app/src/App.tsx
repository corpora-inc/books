import { useSettingsStore } from "@/store/settings";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { Info, SettingsIcon } from "lucide-react";
import { useState } from "react";
import { MainExperience } from "./components/MainExperience";
import { SettingsModal } from "./components/SettingsModal";
import { Button } from "./components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import "./index.css";
import About from "./components/About";

export default function App() {
  const [showSettings, setShowSettings] = useState(false);
  const onboarded = useSettingsStore((s) => s.onboarded);

  if (!onboarded) {
    return <OnboardingWizard />;
  }
  return (
    <>
      <div className="flex flex-col min-h-0 h-screen w-full relative">
        <MainExperience />

        <div className="fixed top-5 right-5 z-50">
          <div className="flex items-center gap-2">
            {/* About Drawer */}
            <Drawer>
              <DrawerTrigger asChild>
                <Button
                  variant="default"
                  size="icon"
                  className="rounded-full shadow-lg bg-white border border-gray-200 hover:bg-gray-100 "
                  aria-label="Settings"
                >
                  <Info className=" w-7 h-7 text-gray-600" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-w-3xl w-full mx-auto shadow-lg">
                <div className="max-h-[80vh] overflow-y-auto">
                  <DrawerHeader>
                    <DrawerTitle className="font-bold text-2xl">
                      About Corpán
                    </DrawerTitle>
                    <DrawerDescription>
                      Instant polyglot practice
                    </DrawerDescription>
                  </DrawerHeader>
                  <About />
                </div>
              </DrawerContent>
            </Drawer>
            <Button
              variant="default"
              size="icon"
              className="rounded-full shadow-lg bg-white border border-gray-200 hover:bg-gray-100 transition"
              aria-label="Settings"
              onClick={() => setShowSettings(true)}
            >
              <SettingsIcon className="w-6 h-6 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>

      <SettingsModal
        open={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
}
