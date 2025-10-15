import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchedUser: {
    name: string;
    photo: string;
    bio?: string;
  } | null;
}

export default function MatchModal({ isOpen, onClose, matchedUser }: MatchModalProps) {
  const navigate = useNavigate();

  if (!matchedUser) return null;

  const handleSendMessage = () => {
    onClose();
    navigate('/messages');
  };

  const handleKeepSwiping = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md overflow-hidden p-0 border-0">
        {/* Celebration Background */}
        <div className="relative bg-gradient-to-br from-pink-500 via-red-500 to-orange-500 p-8 text-center text-white">
          {/* Animated Hearts Background */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <Heart
                key={i}
                className="absolute animate-float-heart text-white/20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                  fontSize: `${1 + Math.random() * 2}rem`,
                }}
                fill="currentColor"
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Sparkle Icon */}
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
                <Sparkles className="h-12 w-12 animate-pulse" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold mb-2 animate-bounce-once">
              It's a Match! 🎉
            </h1>
            <p className="text-white/90 text-lg mb-6">
              You and {matchedUser.name} liked each other!
            </p>

            {/* Matched User Photo */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full blur-lg animate-pulse"></div>
                <img
                  src={matchedUser.photo}
                  alt={matchedUser.name}
                  className="relative w-32 h-32 rounded-full border-4 border-white shadow-2xl object-cover"
                />
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                  <Heart className="h-6 w-6 text-red-500" fill="currentColor" />
                </div>
              </div>
            </div>

            {/* User Info */}
            <h2 className="text-2xl font-bold mb-2">{matchedUser.name}</h2>
            {matchedUser.bio && (
              <p className="text-white/80 text-sm max-w-xs mx-auto mb-6">
                {matchedUser.bio}
              </p>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleSendMessage}
                className="w-full bg-white text-red-500 hover:bg-white/90 font-semibold py-6 text-lg shadow-lg"
                size="lg"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Send a Message
              </Button>
              <Button
                onClick={handleKeepSwiping}
                variant="ghost"
                className="w-full text-white hover:bg-white/10 font-medium"
                size="lg"
              >
                Keep Swiping
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative Bottom Wave */}
        <div className="h-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500"></div>
      </DialogContent>
    </Dialog>
  );
}
