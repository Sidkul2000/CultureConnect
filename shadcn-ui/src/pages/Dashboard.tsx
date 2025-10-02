import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, X, MessageSquare, MapPin, Globe, Menu, User, Calendar, Settings, LogOut, Sparkles, Coffee, Users } from 'lucide-react';
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
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [profileIndex, setProfileIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);

  // Mock profiles for demonstration with warmer, friendlier content
  const mockProfiles: Profile[] = [
    {
      id: '1',
      name: 'Sofia Rodriguez',
      age: 28,
      nationality: 'Brazilian',
      location: 'Miami, FL',
      photos: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=face'],
      bio: 'Marketing professional who loves salsa dancing and exploring new cultures. Looking for genuine connections and someone to share adventures with! 💃🌎',
      culturalJourney: 'Growing up in São Paulo taught me that the best conversations happen over good food and music. I love sharing Brazilian culture and learning about others!',
      interests: ['Salsa Dancing', 'Food Adventures', 'Beach Volleyball', 'Live Music'],
      languages: ['Portuguese', 'English', 'Spanish'],
      compatibility: 92,
      vibe: 'Energetic & Warm'
    },
    {
      id: '2',
      name: 'Priya Sharma',
      age: 26,
      nationality: 'Indian',
      location: 'San Francisco, CA',
      photos: ['https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop&crop=face'],
      bio: 'Tech enthusiast by day, classical dancer by evening! Love hiking, trying new cuisines, and deep conversations about life and dreams. ✨🎭',
      culturalJourney: 'My journey from Mumbai to Silicon Valley has been amazing! I love blending tradition with innovation and sharing the beauty of Indian culture.',
      interests: ['Classical Dance', 'Hiking', 'Cooking', 'Meditation'],
      languages: ['Hindi', 'English', 'Gujarati'],
      compatibility: 88,
      vibe: 'Thoughtful & Creative'
    },
    {
      id: '3',
      name: 'Emma Thompson',
      age: 30,
      nationality: 'American',
      location: 'New York, NY',
      photos: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face'],
      bio: 'World traveler and language lover! Working in international relations has shown me how beautiful cultural diversity is. Let\'s explore the world together! 🌍✈️',
      culturalJourney: 'Every culture I\'ve encountered has taught me something new. I believe the best relationships are built on curiosity, respect, and lots of laughter!',
      interests: ['Travel', 'Languages', 'Photography', 'Yoga'],
      languages: ['English', 'French', 'Spanish', 'Mandarin'],
      compatibility: 85,
      vibe: 'Adventurous & Open-minded'
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

    // Set first profile
    if (mockProfiles.length > 0) {
      setCurrentProfile(mockProfiles[0]);
    }
  }, [navigate]);

  const handleLike = () => {
    if (!currentProfile) return;
    
    toast.success(`You liked ${currentProfile.name}! 💛`, {
      description: "We'll let them know you're interested!"
    });
    
    // Simulate match (60% chance for more positive experience)
    if (Math.random() > 0.4) {
      setTimeout(() => {
        toast.success(`It's a match with ${currentProfile.name}! 🎉`, {
          description: "Start chatting and plan your first cultural adventure!"
        });
      }, 1000);
    }
    
    nextProfile();
  };

  const handlePass = () => {
    if (!currentProfile) return;
    toast.info("No worries, there are plenty more amazing people to meet! 😊");
    nextProfile();
  };

  const nextProfile = () => {
    const nextIndex = (profileIndex + 1) % mockProfiles.length;
    setProfileIndex(nextIndex);
    setCurrentProfile(mockProfiles[nextIndex]);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
    toast.success('Thanks for buzzing with H1bee! See you soon! 🐝');
  };

  if (!currentUser || !currentProfile) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50">
      {/* Navigation Header */}
      <nav className="glass-morphism sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
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
      </nav>

      {/* Main Content */}
      <div className="max-w-md mx-auto py-8 px-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Amazing People</h1>
          <p className="text-gray-600">Swipe through profiles and find your cultural connection 💛</p>
        </div>

        {/* Profile Card */}
        <Card className="overflow-hidden shadow-2xl card-hover bg-white border-0">
          {/* Profile Image */}
          <div className="relative h-96">
            <img
              src={currentProfile.photos[0]}
              alt={currentProfile.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold px-3 py-1">
                {currentProfile.compatibility}% Match ✨
              </Badge>
            </div>
            <div className="absolute top-4 left-4">
              <Badge className="bg-white/90 text-gray-800 font-semibold px-3 py-1">
                {currentProfile.vibe}
              </Badge>
            </div>
            {/* Gradient overlay for better text readability */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>

          <CardContent className="p-6">
            {/* Basic Info */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentProfile.name}, {currentProfile.age}
              </h2>
              <div className="flex items-center text-gray-600 mb-2">
                <Globe className="h-4 w-4 mr-2 text-yellow-500" />
                <span className="font-medium">{currentProfile.nationality}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2 text-pink-500" />
                <span>{currentProfile.location}</span>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-4">
              <p className="text-gray-700 leading-relaxed text-lg">{currentProfile.bio}</p>
            </div>

            {/* Cultural Journey */}
            <div className="mb-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
                Cultural Journey
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">{currentProfile.culturalJourney}</p>
            </div>

            {/* Languages */}
            <div className="mb-4">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                <Globe className="h-4 w-4 mr-2 text-blue-500" />
                Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentProfile.languages.map((language, index) => (
                  <Badge key={index} className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1">
                    {language}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                <Heart className="h-4 w-4 mr-2 text-pink-500" />
                Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentProfile.interests.map((interest, index) => (
                  <Badge key={index} className="bg-pink-100 text-pink-800 hover:bg-pink-200 px-3 py-1">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-6">
              <Button
                size="lg"
                variant="outline"
                onClick={handlePass}
                className="rounded-full w-16 h-16 p-0 border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 transition-all duration-300"
              >
                <X className="h-8 w-8 text-gray-600 hover:text-red-500" />
              </Button>
              
              <Button
                size="lg"
                onClick={() => navigate('/messages')}
                className="rounded-full w-16 h-16 p-0 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <MessageSquare className="h-8 w-8 text-white" />
              </Button>
              
              <Button
                size="lg"
                onClick={handleLike}
                className="rounded-full w-16 h-16 p-0 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-glow"
              >
                <Heart className="h-8 w-8 text-white" />
              </Button>
            </div>

            {/* Action Labels */}
            <div className="flex justify-center space-x-6 mt-3">
              <span className="text-xs text-gray-500 w-16 text-center">Pass</span>
              <span className="text-xs text-gray-500 w-16 text-center">Message</span>
              <span className="text-xs text-gray-500 w-16 text-center">Like</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <Card className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">{profileIndex + 1}</div>
            <div className="text-sm text-gray-600 font-medium">Profiles Viewed</div>
          </Card>
          <Card className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
            <div className="text-2xl font-bold text-green-600">12</div>
            <div className="text-sm text-gray-600 font-medium">Matches</div>
          </Card>
          <Card className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">5</div>
            <div className="text-sm text-gray-600 font-medium">Conversations</div>
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