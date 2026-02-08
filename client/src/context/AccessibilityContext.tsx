import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

type ContrastMode = "normal" | "high" | "dark";

interface AccessibilityContextType {
  fontSize: number;
  contrastMode: ContrastMode;
  setFontSize: (size: number) => void;
  setContrastMode: (mode: ContrastMode) => void;
  resetSettings: () => void;
}

const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

export const AccessibilityProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [fontSize, setFontSize] = useState(100);
  const [contrastMode, setContrastMode] = useState<ContrastMode>("normal");

  // Apply settings to document root
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;

    // Remove all theme classes first
    document.documentElement.classList.remove(
      "theme-normal",
      "theme-high",
      "theme-dark",
    );

    // Add current theme class
    document.documentElement.classList.add(`theme-${contrastMode}`);

    // Apply dark mode to body
    if (contrastMode === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [fontSize, contrastMode]);

  const resetSettings = () => {
    setFontSize(100);
    setContrastMode("normal");
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        contrastMode,
        setFontSize,
        setContrastMode,
        resetSettings,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility must be used within AccessibilityProvider",
    );
  }
  return context;
};
