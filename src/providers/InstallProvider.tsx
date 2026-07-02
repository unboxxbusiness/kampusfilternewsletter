"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface InstallContextType {
  isInstallable: boolean;
  isInstalled: boolean;
  showInstallGuide: boolean;
  setShowInstallGuide: (show: boolean) => void;
  triggerInstall: () => Promise<void>;
}

const InstallContext = createContext<InstallContextType | undefined>(undefined);

export function InstallProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  useEffect(() => {
    const checkIsInstalled = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
      // @ts-ignore
      const isNavStandalone = window.navigator.standalone === true;
      setIsInstalled(isStandalone || isNavStandalone);
    };

    checkIsInstalled();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      setIsInstalled(true);
      console.log("PWA was installed successfully");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Dynamic detection for iOS/Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    // @ts-ignore
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    // @ts-ignore
    const isIOSStandalone = window.navigator.standalone === true;

    if (isIOS && isSafari && !isIOSStandalone) {
      setIsInstallable(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const triggerInstall = async () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    // @ts-ignore
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isIOS && isSafari) {
      setShowInstallGuide(true);
      return;
    }

    if (!deferredPrompt) {
      setShowInstallGuide(true);
      return;
    }

    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    if (outcome === "accepted") {
      setIsInstalled(true);
      setIsInstallable(false);
    }
    
    setDeferredPrompt(null);
  };

  return (
    <InstallContext.Provider
      value={{
        isInstallable,
        isInstalled,
        showInstallGuide,
        setShowInstallGuide,
        triggerInstall,
      }}
    >
      {children}
    </InstallContext.Provider>
  );
}

export function useInstall() {
  const context = useContext(InstallContext);
  if (context === undefined) {
    throw new Error("useInstall must be used within an InstallProvider");
  }
  return context;
}
