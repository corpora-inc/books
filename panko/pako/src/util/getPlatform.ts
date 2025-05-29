// import { platform } from "@tauri-apps/api/os";


export const detectPlatform = async (): Promise<"ios" | "android" | "mac" | "windows" | "linux" | "web" | "unknown"> => {
    // try {
    //     const plat = await platform();
    //     if (plat === "darwin") return "mac";
    //     if (plat === "win32") return "windows";
    //     if (plat === "linux") return "linux";
    // } catch {
    //     // Not running in Tauri, fallback to browser detection
    // }

    // Browser: Use navigator.userAgent
    if (typeof navigator !== "undefined") {
        const ua = navigator.userAgent;
        if (/android/i.test(ua)) return "android";
        if (/iPad|iPhone|iPod/.test(ua)) return "ios";
        if (/Macintosh/.test(ua)) return "mac";
        if (/Windows/.test(ua)) return "windows";
        if (/Linux/.test(ua)) return "linux";
    }

    return "unknown";
};
