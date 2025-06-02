import { useSettingsStore } from "@/store/settings";
import { Switch } from "@/components/ui/switch";

export function RomanizationToggle() {
    const showRomanization = useSettingsStore((s) => s.showRomanization);
    const setShowRomanization = useSettingsStore((s) => s.setShowRomanization);
    const t = useSettingsStore((s) => s.t);

    return (
        <div
            className="w-full flex gap-3 py-3"
        // style={{ maxWidth: 250 }}
        >
            <label
                htmlFor="toggle-romanization"
                className="text-gray-800 text-sm font-medium select-none"
                style={{ minWidth: 0, flex: 1 }}
            >
                {t("Show Romanization")}
            </label>
            <Switch
                id="toggle-romanization"
                checked={showRomanization}
                onCheckedChange={setShowRomanization}
                className="data-[state=checked]:bg-gray-800 data-[state=unchecked]:bg-gray-300 transition-colors"
            />
        </div>
    );
}
