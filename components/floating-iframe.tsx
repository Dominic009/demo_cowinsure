"use client";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Minimize2, Maximize2 } from "lucide-react";

export default function FloatingIframe() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isIframeReady, setIsIframeReady] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setIsMinimized(false);
      setIsIframeReady(false);
      setIsLoading(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };
useEffect(() => {
  if (!isOpen) return;

  setIsLoading(true);
  setIsIframeReady(false);

  const token = "57e11828-3ed8-4825-b6db-c1939c61fcd0";
  let attempt = 0;
  let interval: NodeJS.Timeout | null = null;

  function sendToken() {
    attempt++;

    iframeRef.current?.contentWindow?.postMessage(
      { type: "apikey", token },
      "https://nswebassistant.site"
    );

    if (attempt >= 5) {
      if (interval) clearInterval(interval);
      setIsIframeReady(true);
      setIsLoading(false);
    }
  }

  // Retry every 500ms (mobile-friendly)
  interval = setInterval(sendToken, 500);

  return () => {
    if (interval) clearInterval(interval);
  };
}, [isOpen]);



  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        setIsMinimized(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  // Prevent body scroll when chat is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Panel */}
      {isOpen && (
        <div
          className={`fixed bottom-20 right-4 bg-white dark:bg-gray-900 shadow-2xl rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out transform ${
            isMinimized
              ? "w-80 h-16"
              : "w-96 h-[600px] sm:w-[400px] sm:h-[500px] md:w-[450px] md:h-[550px]"
          }`}
          role="dialog"
          aria-label="Chat interface"
          aria-hidden={!isOpen}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {isMinimized ? "Chat (Minimized)" : "Neural Script Chat"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleMinimize}
                className="flex items-center justify-center h-8 w-8 p-0 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4" />
                ) : (
                  <Minimize2 className="w-4 h-4" />
                )}
              </button>
              <button
                type="button"
                onClick={toggleChat}
                className="flex items-center justify-center h-8 w-8 p-0 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          <div className={`relative h-full overflow-hidden ${isMinimized ? 'hidden' : 'block'}`}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 z-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Loading chat...
                  </span>
                </div>
              </div>
            )}
            
            {!isIframeReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 z-5">
                <div className="text-center p-4">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Initialize Neural Script Chat
                  </p>
                </div>
              </div>
            )}

            <iframe
              ref={iframeRef}
              src="https://nswebassistant.site"
              className="w-full h-full border-0 rounded-b-lg"
              title="Neural Script Chat Interface"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              style={{ display: isIframeReady ? "block" : "none" }}
            />
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={toggleChat}
        className={`flex items-center justify-center h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 ${
          isOpen
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        title={isOpen ? "Close chat" : "Open Neural Script Chat"}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Notification Badge */}
      {!isOpen && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
      )}
    </div>
  );
}
