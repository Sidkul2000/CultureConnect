import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Story {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  image: string;
  timestamp: Date;
  viewed?: boolean;
}

interface StoryCarouselProps {
  stories: Story[];
  onAddStory?: () => void;
}

export default function StoryCarousel({ stories, onAddStory }: StoryCarouselProps) {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [viewedStories, setViewedStories] = useState<Set<string>>(new Set());

  const handleStoryClick = (index: number) => {
    setSelectedStoryIndex(index);
    const storyId = stories[index].id;
    setViewedStories(prev => new Set([...prev, storyId]));
  };

  const handleNext = () => {
    if (selectedStoryIndex !== null && selectedStoryIndex < stories.length - 1) {
      const nextIndex = selectedStoryIndex + 1;
      setSelectedStoryIndex(nextIndex);
      setViewedStories(prev => new Set([...prev, stories[nextIndex].id]));
    }
  };

  const handlePrev = () => {
    if (selectedStoryIndex !== null && selectedStoryIndex > 0) {
      const prevIndex = selectedStoryIndex - 1;
      setSelectedStoryIndex(prevIndex);
      setViewedStories(prev => new Set([...prev, stories[prevIndex].id]));
    }
  };

  const selectedStory = selectedStoryIndex !== null ? stories[selectedStoryIndex] : null;

  return (
    <>
      {/* Story Carousel */}
      <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-yellow-300 scrollbar-track-gray-100">
        {/* Add Story Button */}
        {onAddStory && (
          <div
            onClick={onAddStory}
            className="flex-shrink-0 flex flex-col items-center space-y-2 cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:shadow-xl transition-shadow">
              +
            </div>
            <span className="text-xs text-gray-600 font-medium">Add Story</span>
          </div>
        )}

        {/* Stories */}
        {stories.map((story, index) => (
          <div
            key={story.id}
            onClick={() => handleStoryClick(index)}
            className="flex-shrink-0 flex flex-col items-center space-y-2 cursor-pointer"
          >
            <div
              className={`w-16 h-16 rounded-full p-0.5 ${
                viewedStories.has(story.id)
                  ? 'bg-gray-300'
                  : 'bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500'
              }`}
            >
              <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                <img
                  src={story.userPhoto}
                  alt={story.userName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <span className="text-xs text-gray-600 font-medium max-w-[64px] truncate">
              {story.userName}
            </span>
          </div>
        ))}
      </div>

      {/* Story Viewer Modal */}
      <Dialog open={selectedStoryIndex !== null} onOpenChange={() => setSelectedStoryIndex(null)}>
        <DialogContent className="max-w-md h-[80vh] p-0 bg-black border-0 overflow-hidden">
          {selectedStory && (
            <div className="relative w-full h-full">
              {/* Story Image */}
              <img
                src={selectedStory.image}
                alt={selectedStory.userName}
                className="w-full h-full object-contain"
              />

              {/* Progress Bar */}
              <div className="absolute top-0 left-0 right-0 p-2">
                <div className="flex space-x-1">
                  {stories.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full ${
                        i === selectedStoryIndex
                          ? 'bg-white'
                          : i < selectedStoryIndex
                          ? 'bg-white/70'
                          : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* User Info */}
              <div className="absolute top-4 left-4 right-16 flex items-center space-x-3">
                <img
                  src={selectedStory.userPhoto}
                  alt={selectedStory.userName}
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{selectedStory.userName}</p>
                  <p className="text-white/80 text-xs">
                    {Math.floor((Date.now() - selectedStory.timestamp.getTime()) / (1000 * 60 * 60))}h ago
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedStoryIndex(null)}
                className="absolute top-4 right-4 text-white hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Navigation */}
              {selectedStoryIndex > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
              )}

              {selectedStoryIndex < stories.length - 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
