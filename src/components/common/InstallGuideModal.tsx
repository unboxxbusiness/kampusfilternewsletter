"use client";

import React from "react";
import { X, Share, PlusSquare, Download } from "lucide-react";
import { useInstall } from "@/providers/InstallProvider";

export default function InstallGuideModal() {
  const { showInstallGuide, setShowInstallGuide } = useInstall();

  if (!showInstallGuide) return null;

  const isIOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white dark:bg-[#0c1220] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 transition-all">
        
        <button
          onClick={() => setShowInstallGuide(false)}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="bg-[#fca311]/10 p-2.5 rounded-xl text-[#fca311]">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Install Kampus Filter</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Add to your home screen for quick offline access.</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-neutral-700 dark:text-neutral-300">
          {isIOS ? (
            <div className="space-y-3">
              <p className="font-medium text-neutral-800 dark:text-neutral-200">To install on iOS/Safari:</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  Tap the <span className="inline-flex items-center gap-1 font-semibold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700"><Share className="w-3.5 h-3.5" /> Share</span> button in Safari.
                </li>
                <li>
                  Scroll down the sharing menu and select <span className="inline-flex items-center gap-1 font-semibold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700"><PlusSquare className="w-3.5 h-3.5" /> Add to Home Screen</span>.
                </li>
                <li>
                  Tap <span className="font-bold text-[#fca311]">Add</span> in the top-right corner to complete the installation.
                </li>
              </ol>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="font-medium text-neutral-800 dark:text-neutral-200">How to install standard version:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Look for the <span className="font-semibold text-neutral-900 dark:text-white">Install Icon</span> in your browser's address bar (usually on the right side).
                </li>
                <li>
                  Or open your browser menu (three dots <span className="font-bold">···</span> or <span className="font-bold">⋮</span>) and select <span className="font-semibold text-neutral-900 dark:text-white">"Install app"</span> or <span className="font-semibold text-neutral-900 dark:text-white">"Add to Home screen"</span>.
                </li>
              </ul>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowInstallGuide(false)}
          className="mt-6 w-full bg-[#fca311] text-[#000000] hover:bg-[#e6930f] py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs transition duration-200"
        >
          Got it
        </button>

      </div>
    </div>
  );
}
