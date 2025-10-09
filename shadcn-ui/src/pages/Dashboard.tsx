import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, X, MessageSquare, MapPin, Globe, Menu, User, Calendar, Settings, LogOut, Sparkles, Coffee, Users, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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

interface CurrentUser {
  id: string;
  email: string;
  profileCompleted: boolean;
  profile?: {
    firstName: string;
    lastName: string;
  };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [touchStartTarget, setTouchStartTarget] = useState<EventTarget | null>(null);

  // Enhanced mock profiles with more realistic data
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
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&crop=face'
      ],
      bio: 'Marketing professional who loves salsa dancing and exploring new cultures. Looking for genuine connections and someone to share adventures with! 💃🌎 I believe life is about creating beautiful memories with exceptional people. Whether it\'s trying a new restaurant, dancing until sunrise, or having deep conversations under the stars, I\'m always up for an adventure.',
      culturalJourney: 'Growing up in São Paulo taught me that the best conversations happen over good food and music. I love sharing Brazilian culture and learning about others! My family moved to Miami when I was 15, and it opened my eyes to how beautiful cultural fusion can be. I speak Portuguese at home, English at work, and Spanish with my neighbors - it\'s like living in three worlds at once.',
      interests: ['Salsa Dancing', 'Food Adventures', 'Beach Volleyball', 'Live Music', 'Travel', 'Photography', 'Capoeira', 'Cooking', 'Wine Tasting', 'Art Galleries'],
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
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=400&h=600&fit=crop&crop=face'
      ],
      bio: 'Tech enthusiast by day, classical dancer by evening! Love hiking, trying new cuisines, and deep conversations about life and dreams. ✨🎭 I\'m passionate about using technology to solve real-world problems while staying connected to my cultural roots. When I\'m not coding, you\'ll find me practicing Bharatanatyam or exploring the beautiful trails around the Bay Area.',
      culturalJourney: 'My journey from Mumbai to Silicon Valley has been amazing! I love blending tradition with innovation and sharing the beauty of Indian culture. Moving here taught me that you can embrace new opportunities while honoring your heritage. I organize cultural events in the tech community and love introducing people to Indian festivals, food, and philosophy.',
      interests: ['Classical Dance', 'Hiking', 'Cooking', 'Meditation', 'Technology', 'Art', 'Yoga', 'Reading', 'Volunteering', 'Cultural Events', 'Startups', 'Philosophy'],
      languages: ['Hindi', 'English', 'Gujarati', 'Sanskrit'],
      compatibility: 88,
      vibe: 'Thoughtful & Creative',
      distance: '5 miles away',
      isOnline: false
    },
    {
      id: '3',
      name: 'Emma Thompson',
      age: 30,
      nationality: 'American',
      location: 'New York, NY',
      photos: [
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop&crop=face'
      ],
      bio: 'World traveler and language lover! Working in international relations has shown me how beautiful cultural diversity is. Let\'s explore the world together! 🌍✈️ I\'ve lived in 6 countries and speak 4 languages fluently. My work at the UN has taught me that despite our differences, we all share the same hopes and dreams. I love connecting people from different backgrounds and creating bridges between cultures.',
      culturalJourney: 'Every culture I\'ve encountered has taught me something new. I believe the best relationships are built on curiosity, respect, and lots of laughter! From learning to make dumplings in Beijing to dancing tango in Buenos Aires, each experience has shaped who I am today. I collect stories, recipes, and friendships from around the world.',
      interests: ['Travel', 'Languages', 'Photography', 'Yoga', 'Wine Tasting', 'Museums', 'International Politics', 'Cultural Exchange', 'Writing', 'Documentary Films', 'Sustainable Living', 'Human Rights'],
      languages: ['English', 'French', 'Spanish', 'Mandarin', 'Portuguese'],
      compatibility: 85,
      vibe: 'Adventurous & Open-minded',
      distance: '8 miles away',
      isOnline: true
    },
    {
      id: '4',
      name: 'Kenji Nakamura',
      age: 29,
      nationality: 'Japanese',
      location: 'Los Angeles, CA',
      photos: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face'
      ],
      bio: 'Software engineer with a passion for traditional Japanese arts and modern innovation. Love surfing, ramen hunting, and meaningful conversations! 🏄‍♂️🍜 I find balance between the fast-paced tech world and the mindful practice of traditional arts like calligraphy and tea ceremony. Living in LA has taught me to appreciate both the ocean\'s power and the city\'s creative energy.',
      culturalJourney: 'Balancing my Japanese heritage with life in California has taught me to appreciate both tradition and change. Always excited to share and learn! I grew up with strict discipline and respect for tradition, but California\'s laid-back culture has taught me to be more flexible and open. I love introducing friends to Japanese concepts like ikigai and wabi-sabi.',
      interests: ['Surfing', 'Martial Arts', 'Anime', 'Ramen', 'Gaming', 'Minimalism', 'Calligraphy', 'Tea Ceremony', 'Meditation', 'Rock Climbing', 'Japanese Cinema', 'Sustainable Design'],
      languages: ['Japanese', 'English'],
      compatibility: 91,
      vibe: 'Calm & Innovative',
      distance: '3 miles away',
      isOnline: true
    },
    {
      id: '5',
      name: 'Isabella Martinez',
      age: 27,
      nationality: 'Mexican',
      location: 'Austin, TX',
      photos: [
        'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=600&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop&crop=face'
      ],
      bio: 'Artist and cultural ambassador who believes food is the universal language of love! Always ready for new adventures and deep conversations. 🎨🌮 I run a community art center that celebrates Latino culture and brings people together through creative expression. My abuela\'s recipes and stories inspire my art, and I love sharing both with anyone who\'s interested in authentic Mexican culture.',
      culturalJourney: 'From Mexico City to Austin, I\'ve learned that art and culture bridge all divides. Let\'s create beautiful memories together! Moving to Texas was challenging at first, but I discovered that Austin\'s creative spirit perfectly complements my Mexican heritage. I organize Día de los Muertos celebrations and teach traditional Mexican cooking classes.',
      interests: ['Art', 'Cooking', 'Music Festivals', 'Photography', 'Dancing', 'Travel', 'Community Service', 'Mural Painting', 'Salsa Music', 'Cultural Education', 'Sustainable Fashion', 'Social Justice'],
      languages: ['Spanish', 'English'],
      compatibility: 94,
      vibe: 'Creative & Passionate',
      distance: '4 miles away',
      isOnline: true
    }
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
  }, [navigate]);

  const getCurrentProfile = () => profiles[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (isAnimating || !getCurrentProfile() || isScrolling) return;
    
    setIsAnimating(true);
    setSwipeDirection(direction);
    
    const currentProfile = getCurrentProfile();
    
    if (direction === 'right') {
      toast.success(`You liked ${currentProfile.name}! 💛`, {
        description: "We'll let them know you're interested!"
      });
      
      // Simulate match (70% chance for more positive experience)
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
    if (isScrolling) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isScrolling) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    // If vertical movement is greater than horizontal, it's likely scrolling
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
      setIsScrolling(true);
      setIsDragging(false);
      return;
    }

    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    setIsDragging(false);

    if (Math.abs(dragOffset.x) > 100 && !isScrolling) {
      handleSwipe(dragOffset.x > 0 ? 'right' : 'left');
    }

    setDragOffset({ x: 0, y: 0 });
    setTimeout(() => setIsScrolling(false), 100);
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    setTouchStartTarget(e.target);

    // Check if touch started inside the scrollable content area
    const isScrollArea = scrollAreaRef.current?.contains(target);

    const touch = e.touches[0];
    setDragStart({ x: touch.clientX, y: touch.clientY });

    // Don't start dragging if touch is in scroll area
    if (!isScrollArea) {
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!e.touches[0]) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStart.x;
    const deltaY = touch.clientY - dragStart.y;

    // Detect if this is horizontal swipe or vertical scroll
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);

    // If we haven't determined the gesture yet
    if (!isDragging && !isScrolling && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
      if (isHorizontalSwipe) {
        setIsDragging(true);
        setIsScrolling(false);
      } else {
        setIsScrolling(true);
        setIsDragging(false);
      }
    }

    // If swiping horizontally, update drag offset and prevent scroll
    if (isDragging) {
      e.preventDefault();
      setDragOffset({ x: deltaX, y: deltaY });
    }
  };

  const handleTouchEnd = () => {
    // Complete the swipe if threshold was met
    if (isDragging && Math.abs(dragOffset.x) > 80) {
      handleSwipe(dragOffset.x > 0 ? 'right' : 'left');
    }

    // Reset all states
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setTouchStartTarget(null);
    setTimeout(() => setIsScrolling(false), 200);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
    toast.success('Thanks for buzzing with H1bee! See you soon! 🐝');
  };

  if (!currentUser || profiles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl mb-4 animate-pulse">
            🐝
          </div>
          <p className="text-gray-600 text-lg">Finding your perfect cultural matches...</p>
        </div>
      </div>
    );
  }

  const currentProfile = getCurrentProfile();
  if (!currentProfile) return null;

  // Get visible profiles (current + next 2)
  const visibleProfiles = [];
  for (let i = 0; i < 3; i++) {
    const index = (currentIndex + i) % profiles.length;
    visibleProfiles.push({ ...profiles[index], stackIndex: i });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50">
      {/* Navigation Header */}
      <nav className="glass-morphism sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold animate-pulse-glow">
                🐝
              </div>
              <span className="text-2xl font-bold h1bee-text-gradient">
                H1bee
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-yellow-600 bg-yellow-50 font-semibold">
                <Users className="h-4 w-4 mr-2" />
                Meet People
              </Button>
              <Button variant="ghost" onClick={() => navigate('/feed')}>
                <Sparkles className="h-4 w-4 mr-2" />
                Feed
              </Button>
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
              <Button
                variant="ghost"
                onClick={() => { navigate('/dashboard'); setShowMenu(false); }}
                className="w-full justify-start text-yellow-600 bg-yellow-50 font-semibold"
              >
                <Users className="h-4 w-4 mr-2" />
                Meet People
              </Button>
              <Button
                variant="ghost"
                onClick={() => { navigate('/feed'); setShowMenu(false); }}
                className="w-full justify-start"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Feed
              </Button>
              <Button
                variant="ghost"
                onClick={() => { navigate('/messages'); setShowMenu(false); }}
                className="w-full justify-start"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </Button>
              <Button
                variant="ghost"
                onClick={() => { navigate('/events'); setShowMenu(false); }}
                className="w-full justify-start"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Events
              </Button>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-yellow-50"
                  onClick={() => setShowMenu(false)}
                >
                  <User className="h-4 w-4 mr-2" />
                  {currentUser.profile?.firstName || 'Profile'}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-yellow-50"
                  onClick={() => setShowMenu(false)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="max-w-sm mx-auto py-8 px-4 relative">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Exceptional People</h1>
          <p className="text-gray-600">Swipe right to like, left to pass 💛</p>
        </div>

        {/* Card Stack Container */}
        <div className="relative h-[600px] perspective-1000">
          {/* Render all visible cards with proper stacking */}
          {visibleProfiles.map((profile, index) => {
            const isTopCard = index === 0;
            const zIndex = 30 - index;
            const translateY = index * 8;
            const scale = 1 - index * 0.05;
            const opacity = 1;
            
            return (
              <Card
                key={`${profile.id}-${profile.stackIndex}`}
                ref={isTopCard ? cardRef : undefined}
                className={`absolute inset-0 bg-white border-0 overflow-hidden ${
                  isTopCard ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
                } card-3d-tilt ${
                  isTopCard && swipeDirection === 'left' ? 'animate-swipe-left' :
                  isTopCard && swipeDirection === 'right' ? 'animate-swipe-right' : ''
                }`}
                style={{
                  zIndex,
                  opacity,
                  transform: isTopCard && isDragging
                    ? `translateX(${dragOffset.x}px) translateY(${dragOffset.y * 0.1 + translateY}px) rotate(${dragOffset.x * 0.1}deg) scale(${scale})`
                    : `translateY(${translateY}px) scale(${scale})`,
                  transition: isDragging && isTopCard ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: `0 ${10 + index * 5}px ${30 + index * 10}px rgba(0, 0, 0, ${0.2 - index * 0.05})`,
                  touchAction: 'none'
                }}
                onMouseDown={isTopCard ? handleMouseDown : undefined}
                onMouseMove={isTopCard ? handleMouseMove : undefined}
                onMouseUp={isTopCard ? handleMouseUp : undefined}
                onMouseLeave={isTopCard ? handleMouseUp : undefined}
                onTouchStart={isTopCard ? handleTouchStart : undefined}
                onTouchMove={isTopCard ? handleTouchMove : undefined}
                onTouchEnd={isTopCard ? handleTouchEnd : undefined}
              >
                {/* Swipe Indicators - only on top card */}
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

                {/* Scrollable Profile Content */}
                <div className="relative h-full overflow-hidden">
                  {/* Fixed Photo Header */}
                  <div className="relative h-64 flex-shrink-0">
                    <img
                      src={profile.photos[0]}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between">
                      <div className="flex space-x-2">
                        <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold px-3 py-1">
                          {profile.compatibility}% Match ✨
                        </Badge>
                        {profile.isOnline && (
                          <Badge className="bg-green-500 text-white font-bold px-3 py-1 animate-pulse">
                            🟢 Online
                          </Badge>
                        )}
                      </div>
                      <Badge className="bg-white/90 text-gray-800 font-semibold px-3 py-1">
                        {profile.vibe}
                      </Badge>
                    </div>

                    {/* Photo Indicators */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                      {profile.photos.map((_, photoIndex) => (
                        <div
                          key={photoIndex}
                          className={`w-12 h-1 rounded-full ${photoIndex === 0 ? 'bg-white' : 'bg-white/40'}`}
                        />
                      ))}
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Basic Info Overlay */}
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

                  {/* Scrollable Content Area */}
                  <div
                    ref={isTopCard ? scrollAreaRef : undefined}
                    className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-300 scrollbar-track-gray-100 hover:scrollbar-thumb-yellow-400"
                    style={{ height: 'calc(100% - 16rem)', touchAction: 'pan-y' }}
                    onScroll={() => setIsScrolling(true)}
                    onScrollEnd={() => setTimeout(() => setIsScrolling(false), 100)}
                  >
                    <CardContent className="p-6 space-y-6">
                      {/* Bio */}
                      <div>
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                          <Heart className="h-4 w-4 mr-2 text-pink-500" />
                          About Me
                        </h3>
                        <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                      </div>

                      {/* Cultural Journey */}
                      <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                          <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
                          Cultural Journey
                        </h3>
                        <p className="text-gray-700 text-sm leading-relaxed">{profile.culturalJourney}</p>
                      </div>

                      {/* Languages */}
                      <div>
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                          <Globe className="h-4 w-4 mr-2 text-blue-500" />
                          Languages I Speak
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {profile.languages.map((language, langIndex) => (
                            <Badge key={langIndex} className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Interests */}
                      <div>
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                          <Coffee className="h-4 w-4 mr-2 text-purple-500" />
                          My Interests
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {profile.interests.map((interest, interestIndex) => (
                            <Badge key={interestIndex} className="bg-purple-100 text-purple-800 hover:bg-purple-200 px-3 py-1">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Scroll Indicator */}
                      <div className="text-center py-4 text-gray-400 text-sm">
                        {isTopCard && "👆 Scroll up to see more • Swipe to like/pass 👈👉"}
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-8 mt-8" style={{ touchAction: 'auto' }}>
          <Button
            size="lg"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleSwipe('left');
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isAnimating) handleSwipe('left');
            }}
            disabled={isAnimating}
            className="rounded-full w-16 h-16 p-0 border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 transition-all duration-300 btn-bounce active:scale-95"
            style={{ pointerEvents: 'auto' }}
          >
            <X className="h-8 w-8 text-gray-600 hover:text-red-500" />
          </Button>

          <Button
            size="lg"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/messages');
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isAnimating) navigate('/messages');
            }}
            disabled={isAnimating}
            className="rounded-full w-16 h-16 p-0 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 btn-bounce active:scale-95"
            style={{ pointerEvents: 'auto' }}
          >
            <MessageSquare className="h-8 w-8 text-white" />
          </Button>

          <Button
            size="lg"
            onClick={(e) => {
              e.stopPropagation();
              handleSwipe('right');
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isAnimating) handleSwipe('right');
            }}
            disabled={isAnimating}
            className="rounded-full w-16 h-16 p-0 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-glow btn-bounce active:scale-95"
            style={{ pointerEvents: 'auto' }}
          >
            <Heart className="h-8 w-8 text-white" />
          </Button>

          <Button
            size="lg"
            onClick={(e) => {
              e.stopPropagation();
              toast.success('Super Like sent! ⚡', {
                description: `${currentProfile.name} will see you liked them first!`
              });
              handleSwipe('right');
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isAnimating) {
                toast.success('Super Like sent! ⚡', {
                  description: `${currentProfile.name} will see you liked them first!`
                });
                handleSwipe('right');
              }
            }}
            disabled={isAnimating}
            className="rounded-full w-16 h-16 p-0 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 btn-bounce active:scale-95"
            style={{ pointerEvents: 'auto' }}
          >
            <Star className="h-8 w-8 text-white" />
          </Button>
        </div>

        {/* Action Labels */}
        <div className="flex justify-center space-x-8 mt-3">
          <span className="text-xs text-gray-500 w-16 text-center">Pass</span>
          <span className="text-xs text-gray-500 w-16 text-center">Message</span>
          <span className="text-xs text-gray-500 w-16 text-center">Like</span>
          <span className="text-xs text-gray-500 w-16 text-center">Super Like</span>
        </div>

        {/* Stats Cards */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <Card className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 card-hover">
            <div className="text-2xl font-bold text-yellow-600">{currentIndex + 1}</div>
            <div className="text-xs text-gray-600 font-medium">Profiles Viewed</div>
          </Card>
          <Card className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 card-hover">
            <div className="text-2xl font-bold text-green-600">12</div>
            <div className="text-xs text-gray-600 font-medium">Matches</div>
          </Card>
          <Card className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 card-hover">
            <div className="text-2xl font-bold text-purple-600">5</div>
            <div className="text-xs text-gray-600 font-medium">Super Likes</div>
          </Card>
        </div>

        {/* Encouragement Message */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Remember, every connection is a chance to learn something new! 🌟
          </p>
        </div>
      </div>
    </div>
  );
}