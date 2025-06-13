import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { LanguageSelectOrder } from "./LanguageSelectOrder";
import { DomainPicker } from "./DomainPicker";
import { LevelsPicker } from "./LevelsPicker";
import { RateAdjuster } from "./RateAdjuster";
import { RomanizationToggle } from "./RomanizationToggle";

import { useSettingsStore } from "@/store/settings";
import { Button } from "./ui/button";
import { TextSizeAdjuster } from "./TextSizeAdjuster";

// Use the built-in modal with correct sizing
export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {

    const dir = useSettingsStore((s) => s.dir);
    const t = useSettingsStore((s) => s.t);
    const topLang = useSettingsStore((s) => s.topLang());
    const setOnboarded = useSettingsStore((s) => s.setOnboarded);
    const setOnboardingStep = useSettingsStore((s) => s.setOnboardingStep);
    console.log("new topLang", topLang);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="
                    max-w-full w-[100vw] sm:max-w-[100vw] md:max-w-[90vw] lg:max-w-[75vw] xl:max-w-[60vw]
                    max-h-[100dvh] h-[100dvh] md:h-auto md:max-h-[95dvh]
                    overflow-y-auto rounded-none bg-white
                    md:rounded-lg
                    flex flex-col
                "
                style={{
                    paddingBottom: "2rem",
                    paddingTop: "3rem",
                }}
                id="settings-modal-content"
            >
                <DialogTitle dir={dir()}>
                    {t("Settings")}
                </DialogTitle>
                <DialogDescription dir={dir()}>
                    {t("Adjust to your preferences")}
                </DialogDescription>
                <div className="flex-grow overflow-y-auto">
                    <TextSizeAdjuster />
                    <RateAdjuster />
                    <LanguageSelectOrder />
                    <LevelsPicker />
                    <DomainPicker />
                  <RomanizationToggle />
                </div>
                <Button
                    onClick={() => {
                        setOnboarded(false);
                        setOnboardingStep(0);
                        onClose();
                    }}
                    className="
                        mt-5 w-full rounded-xl px-6 py-8
                        focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2
                        transition-colors cursor-pointer
                        shadow-sm
                    "
                >
                    {t("reonboard")}
                </Button>

            </DialogContent>
        </Dialog>
    );
}
