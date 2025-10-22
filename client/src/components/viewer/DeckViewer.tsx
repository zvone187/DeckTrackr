import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { trackSlideNavigation } from '@/api/viewer';

interface DeckViewerProps {
  deckId: string;
  viewerId: string;
  sessionId: string;
  pageCount: number;
  deckName: string;
  onClose: () => void;
}

export function DeckViewer({ deckId, viewerId, sessionId, pageCount, deckName, onClose }: DeckViewerProps) {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [slideStartTime, setSlideStartTime] = useState(Date.now());

  const trackNavigation = async (newSlide: number, fromSlide: number) => {
    try {
      await trackSlideNavigation({
        deckId,
        viewerId,
        slideNumber: newSlide,
        fromSlide,
      });
      console.log(`Tracked navigation: ${fromSlide} -> ${newSlide}`);
    } catch (error) {
      console.error('Failed to track navigation:', error);
    }
  };

  const goToNextSlide = useCallback(() => {
    if (currentSlide < pageCount) {
      const newSlide = currentSlide + 1;
      trackNavigation(newSlide, currentSlide);
      setCurrentSlide(newSlide);
      setSlideStartTime(Date.now());
    }
  }, [currentSlide, pageCount]);

  const goToPreviousSlide = useCallback(() => {
    if (currentSlide > 1) {
      const newSlide = currentSlide - 1;
      trackNavigation(newSlide, currentSlide);
      setCurrentSlide(newSlide);
      setSlideStartTime(Date.now());
    }
  }, [currentSlide]);

  const goToSlide = (slideNumber: number) => {
    if (slideNumber !== currentSlide && slideNumber >= 1 && slideNumber <= pageCount) {
      trackNavigation(slideNumber, currentSlide);
      setCurrentSlide(slideNumber);
      setSlideStartTime(Date.now());
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentSlide > 1) {
        goToPreviousSlide();
      } else if (e.key === 'ArrowRight' && currentSlide < pageCount) {
        goToNextSlide();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide, pageCount, goToNextSlide, goToPreviousSlide, onClose]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-black/90 backdrop-blur-sm border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <h1 className="text-white text-xl font-semibold">{deckName}</h1>
        <div className="flex items-center gap-4">
          <span className="text-white/70 text-sm">
            Slide {currentSlide} of {pageCount}
          </span>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Viewer */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Actual Slide Display */}
        <div className="w-full max-w-5xl aspect-[16/9] bg-white rounded-lg shadow-2xl flex items-center justify-center overflow-hidden">
          <img
            src={`/api/decks/${deckId}/pages/${currentSlide}`}
            alt={`Slide ${currentSlide}`}
            className="w-full h-full object-contain"
            onError={(e) => {
              console.error(`Failed to load slide ${currentSlide}`);
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect width="800" height="600" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%239ca3af" font-size="24"%3EFailed to load slide%3C/text%3E%3C/svg%3E';
            }}
          />
        </div>

        {/* Navigation Buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 text-white"
          onClick={goToPreviousSlide}
          disabled={currentSlide === 1}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 text-white"
          onClick={goToNextSlide}
          disabled={currentSlide === pageCount}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Thumbnail Sidebar */}
      <div className="bg-black/90 backdrop-blur-sm border-t border-white/10 px-6 py-4">
        <div className="flex gap-2 overflow-x-auto">
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((slideNum) => (
            <button
              key={slideNum}
              onClick={() => goToSlide(slideNum)}
              className={`flex-shrink-0 w-20 h-14 rounded border-2 transition-all overflow-hidden ${
                slideNum === currentSlide
                  ? 'border-primary bg-primary/20'
                  : 'border-white/20 bg-white/5 hover:border-white/40'
              }`}
            >
              <img
                src={`/api/decks/${deckId}/thumbnails/${slideNum}`}
                alt={`Thumbnail ${slideNum}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const div = document.createElement('div');
                    div.className = 'w-full h-full flex items-center justify-center text-white text-xs';
                    div.textContent = slideNum.toString();
                    parent.appendChild(div);
                  }
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}