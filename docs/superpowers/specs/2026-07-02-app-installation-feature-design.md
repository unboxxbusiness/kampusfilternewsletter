# Design Document: PWA App Installation Feature

This document outlines the design and implementation details for adding an app installation feature to Kampus Filter. Users will be able to click an "Install App" link in the Navbar and Footer to install the application on desktop or mobile platforms.

---

## 1. Objectives

- **Install Link in Navbar & Footer**: Provide clear, accessible links/buttons that allow users to install the web application as a Progressive Web App (PWA).
- **Cross-Platform Support**:
  - **Native PWA Prompt**: Trigger native browser installation prompt on supported platforms (Chrome, Edge, Android, etc.) using the `beforeinstallprompt` event.
  - **iOS/Safari Fallback**: Show a clean instruction modal for platforms that require manual installation (Safari on iOS), detailing the "Add to Home Screen" steps.
  - **Installed Detection**: Hide the installation links or change their behavior when the app is already running in standalone mode (installed).
- **Design Alignment**: Integrate links seamlessly into the existing navbar and footer components, maintaining the platform's clean aesthetic.

---

## 2. Technical Solution

### A. Global Install State Provider (`src/providers/InstallProvider.tsx`)
A new React Context/Provider to manage the PWA installation state globally:
- **`beforeinstallprompt` Event Listener**: Listen for this event, prevent the default prompt, and save the event instance to state (`deferredPrompt`).
- **Installed Detection**: Check `window.matchMedia('(display-mode: standalone)').matches` or `navigator.standalone` (iOS) to determine if the app is already installed.
- **Trigger Function**: Export a function `triggerInstall()` that:
  - If `deferredPrompt` is available, calls `.prompt()` and handles the outcome.
  - Otherwise, opens the instruction modal (particularly on iOS/Safari).

### B. Install Guide Modal Component (`src/components/common/InstallGuideModal.tsx`)
A standard Modal dialog component built using Tailwind CSS:
- Responsive design showing specific instructions depending on the user's platform (detected via user-agent or feature detection).
- **iOS/Safari Instructions**: Walk user through tapping the Share button, scroll down, and tap "Add to Home Screen".
- Include visual indicators/icons (like a mock share icon) for a premium feel.

### C. Navbar Integration (`src/components/layout/Navbar.tsx`)
- Add an "Install App" link/button.
  - **Desktop**: Place it in the navigation links list (e.g. next to "About").
  - **Mobile**: Add a clean download/install icon button or text link in the mobile actions section (near the theme toggle).

### D. Footer Integration (`src/components/layout/Footer.tsx`)
- Add "Install App" to the row of links:
  ```tsx
  <button onClick={triggerInstall} className="hover:text-[#fca311] transition-colors hover:underline">
    Install App
  </button>
  ```

---

## 3. Verification Plan

### Automated Verification
- Run `npm run lint` to check for compilation/type-safety issues.
- Run `npm run build` to confirm the production build completes successfully.

### Manual Verification
- **Desktop (Chrome/Edge)**: Load the app, click the Navbar or Footer link, and verify the native PWA install dialog is triggered.
- **Mobile (Chrome/Android)**: Click the install link and check if the native app install prompt pops up.
- **iOS (Safari)**: Click the install link and verify it opens the custom modal detailing how to add to the home screen.
- **Standalone Mode**: Run the app as an installed app (standalone) and confirm that the install links are hidden or disabled.
