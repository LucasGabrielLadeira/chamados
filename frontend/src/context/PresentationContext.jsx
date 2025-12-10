import { createContext, useContext, useState, useEffect } from "react";

const PresentationContext = createContext();

export function PresentationProvider({ children }) {
  const [presentationMode, setPresentationMode] = useState(false);

  async function enterPresentation() {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    }
    setPresentationMode(true);
  }

  async function exitPresentation() {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
    setPresentationMode(false);
  }

  useEffect(() => {
    function handleChange() {
      if (!document.fullscreenElement) {
        setPresentationMode(false);
      }
    }

    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  return (
    <PresentationContext.Provider
      value={{ presentationMode, enterPresentation, exitPresentation }}
    >
      {children}
    </PresentationContext.Provider>
  );
}

export function usePresentation() {
  return useContext(PresentationContext);
}
