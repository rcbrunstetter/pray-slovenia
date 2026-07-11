"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { SplashScreen } from "@capacitor/splash-screen";

export default function SplashHider() {
  useEffect(() => {
    if (Capacitor.getPlatform() !== "ios") return;
    const timer = setTimeout(() => {
      SplashScreen.hide({ fadeOutDuration: 300 });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
