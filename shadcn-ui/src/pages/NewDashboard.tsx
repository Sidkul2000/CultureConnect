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
import MatchModal from '@/components/MatchModal';
import { matchAPI, postAPI } from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';

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
  authorId?: string;
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
  firstName?: string;
  lastName?: string;
  profileCompleted: boolean;
  token?: string;
}

export default function NewDashboard() {
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [activeTab, setActiveTab] = useState('feed');
  const [showMenu, setShowMenu] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState<{ name: string; photo: string; bio?: string } | null>(null);
  const [isSwipeWidgetExpanded, setIsSwipeWidgetExpanded] = useState(false);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
  const [isLoadingFeed, setIsLoadingFeed] = useState(false);

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

  // Load profiles from backend
  const loadProfiles = async () => {
    try {
      setIsLoadingProfiles(true);
      const data = await matchAPI.discover();
      setProfiles(data);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Failed to load profiles:', error);
      toast.error('Failed to load matches. Please try again.');
    } finally {
      setIsLoadingProfiles(false);
    }
  };

  // Load feed from backend
  const loadFeed = async () => {
    try {
      setIsLoadingFeed(true);
      const data = await postAPI.getFeed();
      setFeedPosts(data);
    } catch (error) {
      console.error('Failed to load feed:', error);
      toast.error('Failed to load feed. Please try again.');
    } finally {
      setIsLoadingFeed(false);
    }
  };

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

    // Load real data from backend
    loadProfiles();
    loadFeed();
  }, [navigate]);

  // Listen for real-time match notifications via Pusher
  useEffect(() => {
    if (!socket || !currentUser) return;

    // Subscribe to user's private channel
    const channel = socket.subscribe(`private-user-${currentUser.id}`);

    // Bind to new_match event
    channel.bind('new_match', (data: { matchId: string; user: { name: string; photo: string; bio: string } }) => {
      console.log('Received match notification:', data);

      // Show match modal for the other user
      setMatchedUser({
        name: data.user.name,
        photo: data.user.photo,
        bio: data.user.bio
      });
      setShowMatchModal(true);
    });

    return () => {
      // Unbind event and unsubscribe from channel
      channel.unbind('new_match');
      socket.unsubscribe(`private-user-${currentUser.id}`);
    };
  }, [socket, currentUser]);

  // Swiping functions
  const getCurrentProfile = () => profiles[currentIndex];

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (isAnimating || !getCurrentProfile()) return;

    setIsAnimating(true);
    setSwipeDirection(direction);

    const currentProfile = getCurrentProfile();

    try {
      // Send swipe to backend
      const action = direction === 'right' ? 'LIKE' : 'PASS';
      const result = await matchAPI.swipe(currentProfile.id, action);

      if (direction === 'right') {
        toast.success(`You liked ${currentProfile.name}! 💛`, {
          description: "We'll let them know you're interested!"
        });

        // Check if it's a match
        if (result.isMatch) {
          // Show match modal after animation
          setTimeout(() => {
            setMatchedUser({
              name: currentProfile.name,
              photo: currentProfile.photos[0],
              bio: currentProfile.bio
            });
            setShowMatchModal(true);
          }, 800);
        }
      } else {
        toast.info("No worries, there are plenty more exceptional people to meet! 😊");
      }
    } catch (error) {
      console.error('Swipe error:', error);
      toast.error('Failed to process swipe. Please try again.');
    }

    setTimeout(() => {
      setCurrentIndex(prev => {
        const nextIndex = prev + 1;
        // If we've gone through all profiles, reload
        if (nextIndex >= profiles.length) {
          loadProfiles();
          return 0;
        }
        return nextIndex;
      });
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

  const handleCreatePost = async (newPost: any) => {
    try {
      const createdPost = await postAPI.createPost({
        type: newPost.type.toUpperCase(),
        title: newPost.title,
        content: newPost.content,
        image: newPost.image,
        visibility: newPost.visibility,
        location: newPost.location,
        culturalTheme: newPost.culturalTheme,
        eventDetails: newPost.eventDetails
      });

      // Reload feed to show new post
      loadFeed();
      toast.success('Post created successfully! 🎉');
    } catch (error) {
      console.error('Failed to create post:', error);
      toast.error('Failed to create post. Please try again.');
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const result = await postAPI.likePost(postId);

      // Update local state
      setFeedPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: (post.likes || 0) + (result.liked ? 1 : -1),
            userHasLiked: result.liked
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Failed to like post:', error);
      toast.error('Failed to like post. Please try again.');
    }
  };

  const formatTime = (date: Date | string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diff = now.getTime() - postDate.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (!currentUser) {
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
  for (let i = 0; i < 3 && i < profiles.length; i++) {
    const index = (currentIndex + i) % profiles.length;
    if (profiles[index]) {
      visibleProfiles.push({ ...profiles[index], stackIndex: i });
    }
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
                  <span>{currentUser.firstName || 'Profile'}</span>
                </Button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100">
                    <Button variant="ghost" className="w-full justify-start px-4 py-2 hover:bg-yellow-50" onClick={() => { navigate('/profile'); setShowMenu(false); }}>
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </Button>
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
                <Button variant="ghost" className="w-full justify-start hover:bg-yellow-50" onClick={() => { navigate('/profile'); setShowMenu(false); }}>
                  <User className="h-4 w-4 mr-2" />
                  My Profile
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
                  {isLoadingProfiles ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl mb-4 animate-pulse mx-auto">
                        🐝
                      </div>
                      <p className="text-gray-600">Loading matches...</p>
                    </div>
                  ) : profiles.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">💛</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No more profiles</h3>
                      <p className="text-gray-600 mb-4">Check back later for new matches!</p>
                      <Button onClick={loadProfiles} className="bg-gradient-to-r from-yellow-400 to-orange-500">
                        Refresh Matches
                      </Button>
                    </div>
                  ) : (
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

                                  {profile.culturalJourney && (
                                    <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                                      <h3 className="font-bold text-gray-900 mb-1 text-sm">Cultural Journey</h3>
                                      <p className="text-gray-700 text-xs">{profile.culturalJourney}</p>
                                    </div>
                                  )}

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
                  )}
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
            {isLoadingFeed ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl mb-4 animate-pulse mx-auto">
                  🐝
                </div>
                <p className="text-gray-600">Loading feed...</p>
              </div>
            ) : (
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
            )}
          </TabsContent>

          {/* Discover Tab (Swiping) */}
          <TabsContent value="discover" className="mt-0 px-4 py-8">
            <div className="max-w-sm mx-auto">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Exceptional People</h1>
                <p className="text-gray-600">Swipe right to like, left to pass 💛</p>
              </div>

              {isLoadingProfiles ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl mb-4 animate-pulse mx-auto">
                    🐝
                  </div>
                  <p className="text-gray-600">Loading matches...</p>
                </div>
              ) : profiles.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💛</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No more profiles</h3>
                  <p className="text-gray-600 mb-4">Check back later for new matches!</p>
                  <Button onClick={loadProfiles} className="bg-gradient-to-r from-yellow-400 to-orange-500">
                    Refresh Matches
                  </Button>
                </div>
              ) : (
                <>
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

                              {profile.culturalJourney && (
                                <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                                  <h3 className="font-bold text-gray-900 mb-2">Cultural Journey</h3>
                                  <p className="text-gray-700 text-sm">{profile.culturalJourney}</p>
                                </div>
                              )}

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
                </>
              )}
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

      {/* Match Modal */}
      <MatchModal
        isOpen={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        matchedUser={matchedUser}
      />
    </div>
  );
}