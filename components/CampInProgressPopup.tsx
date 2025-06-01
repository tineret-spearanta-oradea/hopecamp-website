"use client";

import { useState, useEffect } from "react";
import { X, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { dateRange, location } from "@/lib/constants";

const POPUP_STORAGE_KEY = "camp-in-progress-popup-dismissed";

export default function CampInProgressPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const now = new Date();
    const isCampInProgress =
      now >= dateRange.startDate && now <= dateRange.endDate;

    if (!isCampInProgress) {
      return;
    }

    // Check if user has dismissed this popup before
    try {
      const dismissed = localStorage.getItem(POPUP_STORAGE_KEY);
      if (dismissed === "true") {
        return;
      }
    } catch (error) {
      console.error("Failed to read from localStorage:", error);
    }

    setIsVisible(true);
  }, []);

  const handleClose = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem(POPUP_STORAGE_KEY, "true");
      } catch (error) {
        console.error("Failed to save to localStorage:", error);
      }
    }
    setIsVisible(false);
  };

  const firstCharToUppercase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleGoogleMapsClick = () => {
    window.open(location.googleMapsUrl, "_blank", "noopener,noreferrer");
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Închide"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">
                Tabăra este în desfășurare!
              </h3>
            </div>
          </div>

          {/* Location details */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">
              Locația taberei:
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>{firstCharToUppercase(location.campusName)}</strong>
              </p>
              <p>{firstCharToUppercase(location.addressLine)}</p>
            </div>
          </div>

          {/* Google Maps button */}
          <Button
            onClick={handleGoogleMapsClick}
            className="w-full mb-4 bg-primary hover:bg-primary/90"
            size="lg"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Deschide în Google Maps
          </Button>

          {/* Don't show again option */}
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id="dont-show-again"
              checked={dontShowAgain}
              onCheckedChange={(checked) =>
                setDontShowAgain(checked as boolean)
              }
            />
            <label
              htmlFor="dont-show-again"
              className="text-sm text-gray-600 cursor-pointer"
            >
              Nu mai afișa acest mesaj
            </label>
          </div>

          {/* Close button */}
          <Button onClick={handleClose} variant="outline" className="w-full">
            Închide
          </Button>
        </div>
      </div>
    </div>
  );
}
