import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Heart, X, MessageSquare, MapPin, Globe, Menu, User, Calendar, Settings, LogOut,
  Sparkles, Coffee, Users, Star, Zap, Plus, Home, Compass, Bell,
  ExternalLink, Newspaper, PartyPopper, Send, ThumbsUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import CreatePostModal from '@/components/CreatePostModal';

interface Profile {
  id: string;
  name: string;
  age: number;
  nationality: string;
  location: string;
  photos: string[];
  bio: string;
  culturalJourney: string;
  interests: string[];
  languages: string[];
  compatibility: number;
  vibe: string;
  distance: string;
  isOnline: boolean;
}

interface FeedPost {
  id: string;
  type: 'event' | 'news' | 'user_post' | 'story';
  title: string;
  content: string;
  image?: string;
  author?: string;
  authorPhoto?: string;
  timestamp: Date;
  location?: string;
  attendees?: number;
  price?: number;
  culturalTheme?: string;
  likes?: number;
  comments?: number;
  userHasLiked?: boolean;
}


interface CurrentUser {
  id: string;
  email: string;
  profileCompleted: boolean;
  profile?: {
    firstName: string;
    lastName: string;
  };
}

export default function NewDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [activeTab, setActiveTab] = useState('feed');
  const [showMenu, setShowMenu] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [isSwipeWidgetExpanded, setIsSwipeWidgetExpanded] = useState(false);

  // Swiping state
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Feed state
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]);

  // Mock data
  const mockProfiles: Profile[] = [
    {
      id: '1',
      name: 'Sofia Rodriguez',
      age: 28,
      nationality: 'Brazilian',
      location: 'Miami, FL',
      photos: [
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1494790108755-2616b332c1c2?w=400&h=600&fit=crop&crop=face',
      ],
      bio: 'Marketing professional who loves salsa dancing and exploring new cultures. Looking for genuine connections! 💃🌎',
      culturalJourney: 'Growing up in São Paulo taught me that the best conversations happen over good food and music.',
      interests: ['Salsa Dancing', 'Food Adventures', 'Beach Volleyball', 'Live Music', 'Travel'],
      languages: ['Portuguese', 'English', 'Spanish'],
      compatibility: 92,
      vibe: 'Energetic & Warm',
      distance: '2 miles away',
      isOnline: true
    },
    {
      id: '2',
      name: 'Priya Sharma',
      age: 26,
      nationality: 'Indian',
      location: 'San Francisco, CA',
      photos: [
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop&crop=face',
      ],
      bio: 'Tech enthusiast by day, classical dancer by evening! Love hiking and deep conversations. ✨🎭',
      culturalJourney: 'My journey from Mumbai to Silicon Valley has been amazing! I love blending tradition with innovation.',
      interests: ['Classical Dance', 'Hiking', 'Cooking', 'Meditation', 'Technology'],
      languages: ['Hindi', 'English', 'Gujarati'],
      compatibility: 88,
      vibe: 'Thoughtful & Creative',
      distance: '5 miles away',
      isOnline: false
    },
    {
      id: '3',
      name: 'Kenji Nakamura',
      age: 29,
      nationality: 'Japanese',
      location: 'Los Angeles, CA',
      photos: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face',
      ],
      bio: 'Software engineer with a passion for traditional Japanese arts. Love surfing and ramen! 🏄‍♂️🍜',
      culturalJourney: 'Balancing my Japanese heritage with life in California has taught me to appreciate both tradition and change.',
      interests: ['Surfing', 'Martial Arts', 'Anime', 'Ramen', 'Gaming'],
      languages: ['Japanese', 'English'],
      compatibility: 91,
      vibe: 'Calm & Innovative',
      distance: '3 miles away',
      isOnline: true
    },
  ];

  const mockFeedPosts: FeedPost[] = [
    {
      id: '1',
      type: 'event',
      title: 'Brazilian Carnival Night 🎭',
      content: 'Join us for an authentic Brazilian Carnival celebration with live samba music, traditional food, and dancing lessons!',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&h=300&fit=crop',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      location: 'Miami, FL',
      attendees: 45,
      price: 25,
      culturalTheme: 'Brazilian',
      likes: 127,
      comments: 23,
      author: 'H1bee Events',
      authorPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face',
      userHasLiked: false
    },
    {
      id: '2',
      type: 'user_post',
      title: 'My Cultural Exchange Journey 🌍',
      content: 'Just got back from the most amazing cultural exchange in Tokyo! The tea ceremony workshop changed my perspective on mindfulness and tradition. Highly recommend everyone to step out of their comfort zone!',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&h=300&fit=crop',
      author: 'Emma Chen',
      authorPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      likes: 89,
      comments: 12,
      userHasLiked: false
    },
    {
      id: '3',
      type: 'story',
      title: 'Cross-Cultural Love Success ❤️',
      content: 'Maria from Mexico and John from Texas share their beautiful cross-cultural love story and how they navigated cultural differences to build an amazing relationship.',
      image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=500&h=300&fit=crop',
      author: 'H1bee Community',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      likes: 234,
      comments: 45,
      userHasLiked: true
    },
    {
      id: '4',
      type: 'event',
      title: 'Holi Festival of Colors 🌈',
      content: 'Celebrate spring and new beginnings with the joyful Indian festival of Holi! Throw colorful powders, dance to Bollywood beats, enjoy delicious Indian sweets.',
      image: 'https://images.unsplash.com/photo-1603228254119-e6a4d095dc59?w=500&h=300&fit=crop',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
      location: 'San Francisco, CA',
      attendees: 67,
      price: 15,
      culturalTheme: 'Indian',
      likes: 156,
      comments: 31,
      author: 'Bay Area H1bee',
      userHasLiked: false
    },
  ];

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/auth');
      return;
    }

    const userData = JSON.parse(user) as CurrentUser;
    setCurrentUser(userData);

    if (!userData.profileCompleted) {
      navigate('/profile-setup');
      return;
    }

    setProfiles(mockProfiles);
    setFeedPosts(mockFeedPosts);
  }, [navigate]);

  // Swiping functions
  const getCurrentProfile = () => profiles[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (isAnimating || !getCurrentProfile()) return;

    setIsAnimating(true);
    setSwipeDirection(direction);

    const currentProfile = getCurrentProfile();

    if (direction === 'right') {
      toast.success(`You liked ${currentProfile.name}! 💛`, {
        description: "We'll let them know you're interested!"
      });

      if (Math.random() > 0.3) {
        setTimeout(() => {
          toast.success(`It's a match with ${currentProfile.name}! 🎉`, {
            description: "Start chatting and plan your first cultural adventure!"
          });
        }, 1000);
      }
    } else {
      toast.info("No worries, there are plenty more exceptional people to meet! 😊");
    }

    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % profiles.length);
      setSwipeDirection(null);
      setIsAnimating(false);
    }, 500);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    if (Math.abs(dragOffset.x) > 100) {
      handleSwipe(dragOffset.x > 0 ? 'right' : 'left');
    }
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !e.touches[0]) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStart.x;
    const deltaY = touch.clientY - dragStart.y;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 5) {
      e.preventDefault();
    }

    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleTouchEnd = () => {
    if (Math.abs(dragOffset.x) > 80) {
      handleSwipe(dragOffset.x > 0 ? 'right' : 'left');
    }
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
    toast.success('Thanks for buzzing with H1bee! See you soon! 🐝');
  };

  const handleCreatePost = (newPost: any) => {
    setFeedPosts(prev => [newPost, ...prev]);
  };

  const handleLikePost = (postId: string) => {
    setFeedPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: (post.likes || 0) + (post.userHasLiked ? -1 : 1),
          userHasLiked: !post.userHasLiked
        };
      }
      return post;
    }));
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (!currentUser || profiles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl mb-4 animate-pulse">
            🐝
          </div>
          <p className="text-gray-600 text-lg">Loading your H1bee experience...</p>
        </div>
      </div>
    );
  }

  const currentProfile = getCurrentProfile();
  const visibleProfiles = [];
  for (let i = 0; i < 3; i++) {
    const index = (currentIndex + i) % profiles.length;
    visibleProfiles.push({ ...profiles[index], stackIndex: i });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 pb-20 md:pb-0">
      {/* Desktop/Tablet Navigation Header */}
      <nav className="glass-morphism sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold animate-pulse-glow">
                🐝
              </div>
              <span className="text-2xl font-bold h1bee-text-gradient">H1bee</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/messages')}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </Button>
              <Button variant="ghost" onClick={() => navigate('/events')}>
                <Calendar className="h-4 w-4 mr-2" />
                Events
              </Button>
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center space-x-2"
                >
                  <User className="h-5 w-5" />
                  <span>{currentUser.profile?.firstName || 'Profile'}</span>
                </Button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100">
                    <Button variant="ghost" className="w-full justify-start px-4 py-2 hover:bg-yellow-50">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                    <Button variant="ghost" className="w-full justify-start px-4 py-2 hover:bg-red-50" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu */}
            <Button variant="ghost" className="md:hidden" onClick={() => setShowMenu(!showMenu)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {showMenu && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              <Button variant="ghost" className="w-full justify-start" onClick={() => { navigate('/messages'); setShowMenu(false); }}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => { navigate('/events'); setShowMenu(false); }}>
                <Calendar className="h-4 w-4 mr-2" />
                Events
              </Button>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <Button variant="ghost" className="w-full justify-start hover:bg-yellow-50" onClick={() => setShowMenu(false)}>
                  <User className="h-4 w-4 mr-2" />
                  {currentUser.profile?.firstName || 'Profile'}
                </Button>
                <Button variant="ghost" className="w-full justify-start hover:bg-yellow-50" onClick={() => setShowMenu(false)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start hover:bg-red-50" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content with Tabs */}
      <div className="max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="hidden md:grid w-full grid-cols-2 h-14 sticky top-16 z-40 bg-white/90 backdrop-blur-md border-b">
            <TabsTrigger value="feed" className="text-base">
              <Home className="h-5 w-5 mr-2" />
              Feed
            </TabsTrigger>
            <TabsTrigger value="discover" className="text-base">
              <Compass className="h-5 w-5 mr-2" />
              Discover
            </TabsTrigger>
          </TabsList>

          {/* Feed Tab */}
          <TabsContent value="feed" className="mt-0 px-4 py-6 space-y-6">
            {/* Expandable Swipe Widget */}
            <Card className="overflow-hidden shadow-sm hover:shadow-lg transition-all">
              {/* Collapsed Header - Click to Expand */}
              <div
                className="bg-gradient-to-r from-pink-50 via-rose-50 to-orange-50 cursor-pointer hover:from-pink-100 hover:via-rose-100 hover:to-orange-100 transition-all p-4 border-b border-pink-100"
                onClick={() => setIsSwipeWidgetExpanded(!isSwipeWidgetExpanded)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white shadow-md">
                      <Heart className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">Discover People</p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <span className="text-pink-500 font-semibold">{profiles.length}</span> profiles waiting
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`transform transition-all duration-300 ${isSwipeWidgetExpanded ? 'rotate-180' : ''}`}>
                      <svg
                        className="w-6 h-6 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Swipe Area */}
              {isSwipeWidgetExpanded && (
                <div className="p-4 bg-white">
                  <div className="max-w-sm mx-auto">
                    {/* Mini Card Stack */}
                    <div className="relative h-[500px] perspective-1000 mb-4">
                      {visibleProfiles.map((profile, index) => {
                        const isTopCard = index === 0;
                        const zIndex = 30 - index;
                        const translateY = index * 6;
                        const scale = 1 - index * 0.04;

                        return (
                          <Card
                            key={`${profile.id}-${profile.stackIndex}`}
                            ref={isTopCard ? cardRef : undefined}
                            className={`absolute inset-0 bg-white border-0 overflow-hidden ${
                              isTopCard ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
                            } ${
                              isTopCard && swipeDirection === 'left' ? 'animate-swipe-left' :
                              isTopCard && swipeDirection === 'right' ? 'animate-swipe-right' : ''
                            }`}
                            style={{
                              zIndex,
                              transform: isTopCard && isDragging
                                ? `translateX(${dragOffset.x}px) translateY(${dragOffset.y * 0.1 + translateY}px) rotate(${dragOffset.x * 0.1}deg) scale(${scale})`
                                : `translateY(${translateY}px) scale(${scale})`,
                              transition: isDragging && isTopCard ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              boxShadow: `0 ${10 + index * 5}px ${30 + index * 10}px rgba(0, 0, 0, ${0.2 - index * 0.05})`
                            }}
                            onMouseDown={isTopCard ? handleMouseDown : undefined}
                            onMouseMove={isTopCard ? handleMouseMove : undefined}
                            onMouseUp={isTopCard ? handleMouseUp : undefined}
                            onMouseLeave={isTopCard ? handleMouseUp : undefined}
                            onTouchStart={isTopCard ? handleTouchStart : undefined}
                            onTouchMove={isTopCard ? handleTouchMove : undefined}
                            onTouchEnd={isTopCard ? handleTouchEnd : undefined}
                            onTouchCancel={isTopCard ? handleTouchEnd : undefined}
                          >
                            {isTopCard && (
                              <>
                                <div className={`swipe-indicator like ${dragOffset.x > 50 ? 'visible' : ''}`}>
                                  💛 LIKE
                                </div>
                                <div className={`swipe-indicator pass ${dragOffset.x < -50 ? 'visible' : ''}`}>
                                  ❌ PASS
                                </div>
                              </>
                            )}

                            <div className="relative h-full overflow-hidden">
                              <div className="relative h-48 flex-shrink-0">
                                <img
                                  src={profile.photos[0]}
                                  alt={profile.name}
                                  className="w-full h-full object-cover"
                                />

                                <div className="absolute top-3 left-3 right-3 flex justify-between">
                                  <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold px-2 py-1 text-xs">
                                    {profile.compatibility}% Match ✨
                                  </Badge>
                                  {profile.isOnline && (
                                    <Badge className="bg-green-500 text-white font-bold px-2 py-1 text-xs animate-pulse">
                                      🟢 Online
                                    </Badge>
                                  )}
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                  <h2 className="text-xl font-bold mb-1">
                                    {profile.name}, {profile.age}
                                  </h2>
                                  <div className="flex items-center mb-1">
                                    <Globe className="h-3 w-3 mr-2 text-yellow-300" />
                                    <span className="font-medium text-xs">{profile.nationality}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="h-3 w-3 mr-2 text-pink-300" />
                                    <span className="text-xs">{profile.distance}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ height: 'calc(100% - 12rem)' }}>
                                <div>
                                  <h3 className="font-bold text-gray-900 mb-1 text-sm">About Me</h3>
                                  <p className="text-gray-700 leading-relaxed text-sm">{profile.bio}</p>
                                </div>

                                <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                                  <h3 className="font-bold text-gray-900 mb-1 text-sm">Cultural Journey</h3>
                                  <p className="text-gray-700 text-xs">{profile.culturalJourney}</p>
                                </div>

                                <div>
                                  <h3 className="font-bold text-gray-900 mb-1 text-sm">Languages</h3>
                                  <div className="flex flex-wrap gap-1">
                                    {profile.languages.map((lang, i) => (
                                      <Badge key={i} className="bg-blue-100 text-blue-800 text-xs">
                                        {lang}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <h3 className="font-bold text-gray-900 mb-1 text-sm">Interests</h3>
                                  <div className="flex flex-wrap gap-1">
                                    {profile.interests.map((interest, i) => (
                                      <Badge key={i} className="bg-purple-100 text-purple-800 text-xs">
                                        {interest}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4">
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={() => !isAnimating && handleSwipe('left')}
                        disabled={isAnimating}
                        className="rounded-full w-14 h-14 p-0 border-2 hover:border-red-400 hover:bg-red-50 active:scale-90"
                      >
                        <X className="h-6 w-6 text-gray-600" />
                      </Button>

                      <Button
                        size="lg"
                        onClick={() => !isAnimating && handleSwipe('right')}
                        disabled={isAnimating}
                        className="rounded-full w-14 h-14 p-0 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-lg active:scale-90"
                      >
                        <Heart className="h-6 w-6 text-white" />
                      </Button>

                      <Button
                        size="lg"
                        onClick={() => {
                          if (!isAnimating) {
                            toast.success('Super Like sent! ⚡');
                            handleSwipe('right');
                          }
                        }}
                        disabled={isAnimating}
                        className="rounded-full w-14 h-14 p-0 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-lg active:scale-90"
                      >
                        <Star className="h-6 w-6 text-white" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Create Post Button */}
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowCreatePost(true)}>
              <CardContent className="flex items-center space-x-4 p-4">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white">
                  <Plus className="h-5 w-5" />
                </div>
                <p className="text-gray-600 font-medium">Share your story, create an event, or post news...</p>
              </CardContent>
            </Card>

            {/* Feed Posts */}
            <div className="space-y-6">
              {feedPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Post Header */}
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {post.authorPhoto && (
                          <img
                            src={post.authorPhoto}
                            alt={post.author}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{post.author}</p>
                          <p className="text-xs text-gray-500">{formatTime(post.timestamp)}</p>
                        </div>
                      </div>
                      {post.type === 'event' && (
                        <Badge className="bg-blue-100 text-blue-800">
                          <Calendar className="h-3 w-3 mr-1" />
                          Event
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  {/* Post Content */}
                  <CardContent className="space-y-3 pt-0">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{post.title}</h3>
                      <p className="text-gray-700 leading-relaxed">{post.content}</p>
                    </div>

                    {/* Post Image */}
                    {post.image && (
                      <div className="rounded-lg overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    )}

                    {/* Event Details */}
                    {post.type === 'event' && (
                      <div className="flex flex-wrap gap-3 text-sm">
                        {post.location && (
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-1" />
                            {post.location}
                          </div>
                        )}
                        {post.attendees !== undefined && (
                          <div className="flex items-center text-gray-600">
                            <Users className="h-4 w-4 mr-1" />
                            {post.attendees} interested
                          </div>
                        )}
                        {post.price !== undefined && (
                          <div className="flex items-center text-gray-600 font-semibold">
                            ${post.price}
                          </div>
                        )}
                        {post.culturalTheme && (
                          <Badge variant="outline" className="text-xs">
                            {post.culturalTheme} Culture
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Post Actions */}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLikePost(post.id)}
                          className={post.userHasLiked ? 'text-pink-500' : 'text-gray-600'}
                        >
                          <Heart className={`h-5 w-5 mr-1 ${post.userHasLiked ? 'fill-current' : ''}`} />
                          {post.likes || 0}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600">
                          <MessageSquare className="h-5 w-5 mr-1" />
                          {post.comments || 0}
                        </Button>
                      </div>
                      {post.type === 'event' && (
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600"
                          onClick={() => {
                            toast.success('Redirecting to Events page! 🎉');
                            navigate('/events');
                          }}
                        >
                          <PartyPopper className="h-4 w-4 mr-1" />
                          Attend
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Discover Tab (Swiping) */}
          <TabsContent value="discover" className="mt-0 px-4 py-8">
            <div className="max-w-sm mx-auto">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Exceptional People</h1>
                <p className="text-gray-600">Swipe right to like, left to pass 💛</p>
              </div>

              {/* Card Stack */}
              <div className="relative h-[600px] perspective-1000 mb-8">
                {visibleProfiles.map((profile, index) => {
                  const isTopCard = index === 0;
                  const zIndex = 30 - index;
                  const translateY = index * 8;
                  const scale = 1 - index * 0.05;

                  return (
                    <Card
                      key={`${profile.id}-${profile.stackIndex}`}
                      ref={isTopCard ? cardRef : undefined}
                      className={`absolute inset-0 bg-white border-0 overflow-hidden ${
                        isTopCard ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
                      } ${
                        isTopCard && swipeDirection === 'left' ? 'animate-swipe-left' :
                        isTopCard && swipeDirection === 'right' ? 'animate-swipe-right' : ''
                      }`}
                      style={{
                        zIndex,
                        transform: isTopCard && isDragging
                          ? `translateX(${dragOffset.x}px) translateY(${dragOffset.y * 0.1 + translateY}px) rotate(${dragOffset.x * 0.1}deg) scale(${scale})`
                          : `translateY(${translateY}px) scale(${scale})`,
                        transition: isDragging && isTopCard ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: `0 ${10 + index * 5}px ${30 + index * 10}px rgba(0, 0, 0, ${0.2 - index * 0.05})`
                      }}
                      onMouseDown={isTopCard ? handleMouseDown : undefined}
                      onMouseMove={isTopCard ? handleMouseMove : undefined}
                      onMouseUp={isTopCard ? handleMouseUp : undefined}
                      onMouseLeave={isTopCard ? handleMouseUp : undefined}
                      onTouchStart={isTopCard ? handleTouchStart : undefined}
                      onTouchMove={isTopCard ? handleTouchMove : undefined}
                      onTouchEnd={isTopCard ? handleTouchEnd : undefined}
                      onTouchCancel={isTopCard ? handleTouchEnd : undefined}
                    >
                      {isTopCard && (
                        <>
                          <div className={`swipe-indicator like ${dragOffset.x > 50 ? 'visible' : ''}`}>
                            💛 LIKE
                          </div>
                          <div className={`swipe-indicator pass ${dragOffset.x < -50 ? 'visible' : ''}`}>
                            ❌ PASS
                          </div>
                        </>
                      )}

                      <div className="relative h-full overflow-hidden">
                        <div className="relative h-64 flex-shrink-0">
                          <img
                            src={profile.photos[0]}
                            alt={profile.name}
                            className="w-full h-full object-cover"
                          />

                          <div className="absolute top-4 left-4 right-4 flex justify-between">
                            <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold px-3 py-1">
                              {profile.compatibility}% Match ✨
                            </Badge>
                            {profile.isOnline && (
                              <Badge className="bg-green-500 text-white font-bold px-3 py-1 animate-pulse">
                                🟢 Online
                              </Badge>
                            )}
                          </div>

                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <h2 className="text-2xl font-bold mb-1">
                              {profile.name}, {profile.age}
                            </h2>
                            <div className="flex items-center mb-1">
                              <Globe className="h-4 w-4 mr-2 text-yellow-300" />
                              <span className="font-medium text-sm">{profile.nationality}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-pink-300" />
                              <span className="text-sm">{profile.distance}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ height: 'calc(100% - 16rem)' }}>
                          <div>
                            <h3 className="font-bold text-gray-900 mb-2">About Me</h3>
                            <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                          </div>

                          <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                            <h3 className="font-bold text-gray-900 mb-2">Cultural Journey</h3>
                            <p className="text-gray-700 text-sm">{profile.culturalJourney}</p>
                          </div>

                          <div>
                            <h3 className="font-bold text-gray-900 mb-2">Languages</h3>
                            <div className="flex flex-wrap gap-2">
                              {profile.languages.map((lang, i) => (
                                <Badge key={i} className="bg-blue-100 text-blue-800">
                                  {lang}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-bold text-gray-900 mb-2">Interests</h3>
                            <div className="flex flex-wrap gap-2">
                              {profile.interests.map((interest, i) => (
                                <Badge key={i} className="bg-purple-100 text-purple-800">
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-6">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => !isAnimating && handleSwipe('left')}
                  disabled={isAnimating}
                  className="rounded-full w-16 h-16 p-0 border-2 hover:border-red-400 hover:bg-red-50 active:scale-90"
                >
                  <X className="h-8 w-8 text-gray-600" />
                </Button>

                <Button
                  size="lg"
                  onClick={() => !isAnimating && handleSwipe('right')}
                  disabled={isAnimating}
                  className="rounded-full w-16 h-16 p-0 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-lg active:scale-90"
                >
                  <Heart className="h-8 w-8 text-white" />
                </Button>

                <Button
                  size="lg"
                  onClick={() => {
                    if (!isAnimating) {
                      toast.success('Super Like sent! ⚡');
                      handleSwipe('right');
                    }
                  }}
                  disabled={isAnimating}
                  className="rounded-full w-16 h-16 p-0 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-lg active:scale-90"
                >
                  <Star className="h-8 w-8 text-white" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-4 h-16">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex flex-col items-center justify-center space-y-1 ${
              activeTab === 'feed' ? 'text-yellow-600' : 'text-gray-600'
            }`}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs font-medium">Feed</span>
          </button>
          <button
            onClick={() => setActiveTab('discover')}
            className={`flex flex-col items-center justify-center space-y-1 ${
              activeTab === 'discover' ? 'text-yellow-600' : 'text-gray-600'
            }`}
          >
            <Compass className="h-6 w-6" />
            <span className="text-xs font-medium">Discover</span>
          </button>
          <button
            onClick={() => navigate('/messages')}
            className="flex flex-col items-center justify-center space-y-1 text-gray-600"
          >
            <MessageSquare className="h-6 w-6" />
            <span className="text-xs font-medium">Messages</span>
          </button>
          <button
            onClick={() => navigate('/events')}
            className="flex flex-col items-center justify-center space-y-1 text-gray-600"
          >
            <Calendar className="h-6 w-6" />
            <span className="text-xs font-medium">Events</span>
          </button>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onCreatePost={handleCreatePost}
      />
    </div>
  );
}
