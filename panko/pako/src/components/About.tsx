import { useEffect, useState } from "react";
import { getVersion } from "@tauri-apps/api/app";
import { openUrl } from "@tauri-apps/plugin-opener";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GithubIcon, Globe, Mail, Info } from "lucide-react";
import { detectPlatform } from "@/util/getPlatform";

const APPLE_LINK = "https://apps.apple.com/us/app/corp%C3%A1n/id6746082061";
const PLAY_LINK = "https://play.google.com/store/apps/details?id=com.corpora.corpan";
const WEBSITE_URL = "https://encorpora.io";
const GITHUB_ISSUES = "https://github.com/corpora-inc/encorpora/issues";
const SUPPORT_EMAIL = "mailto:team@encorpora.io";

const About = () => {
  const [appVersion, setAppVersion] = useState<string>("");
  const [currentPlatform, setCurrentPlatform] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const version = await getVersion();
        setAppVersion(version);
      } catch (e) {
        console.error("Failed to get app version:", e);
        setAppVersion("N/A");
      }

      try {
        const plat = await detectPlatform();
        setCurrentPlatform(plat);
      } catch (e) {
        console.error("Failed to get platform:", e);
        setCurrentPlatform("unknown");
      }
    })();
  }, []);

  const renderStoreLinks = () => {
    const items = [];

    if (currentPlatform === "ios" || currentPlatform === "mac") {
      items.push({ url: APPLE_LINK, label: "Download Corpán on the App Store" });
    } else if (currentPlatform === "android") {
      items.push({ url: PLAY_LINK, label: "Get Corpán on Google Play" });
    } else {
      items.push(
        { url: APPLE_LINK, label: "App Store (iOS, macOS)" },
        { url: PLAY_LINK, label: "Google Play (Android)" }
      );
    }

    return (
      <div className="flex flex-col sm:flex-row gap-3">
        {items.map(({ url, label }) => (
          <Button
            key={url}
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => openUrl(url)}
          >
            <Globe className="h-4 w-4" />
            {label}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-full px-4 py-6 gap-4">
      {/* Version Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-base font-medium">App version</h3>
        </div>
        <Badge variant="outline" className="px-3 py-1 text-sm">
          {appVersion || "Loading..."}
        </Badge>
      </div>

      {/* Website Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-base font-medium">Website</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => openUrl(WEBSITE_URL)}
        >
          <Globe className="h-4 w-4" />
          encorpora.io
        </Button>
      </div>

      {/* Support & Feedback Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Mail className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-base font-medium">Support & Feedback</h3>
        </div>

        <p className="text-muted-foreground text-sm mb-4">
          For issues or suggestions, please visit our GitHub repository or contact us via email.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => openUrl(GITHUB_ISSUES)}
          >
            <GithubIcon className="h-4 w-4" />
            GitHub issues
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => openUrl(SUPPORT_EMAIL)}
          >
            <Mail className="h-4 w-4" />
            team@encorpora.io
          </Button>
        </div>
      </div>

      {/* Corpán Promotion Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Info className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-base font-medium">Try our new app: Corpán</h3>
        </div>
        <p className="text-muted-foreground text-sm mb-4">
          We've launched Corpán, our next-generation language learning app! Upgrade now!
        </p>
        {renderStoreLinks()}
      </div>

      {/* Footer */}
      <p className="items-end justify-self-end text-xs text-center text-muted-foreground pt-4">
        © {new Date().getFullYear()} Corpora Inc — Pako
      </p>
    </div>
  );
};

export default About;
