import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, X, MessageSquare, MapPin, Globe, Menu, User, Calendar, Settings, LogOut } from 'lucide-react';
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

  // Mock profiles for demonstration
  const mockProfiles: Profile[] = [
    {
      id: '1',
      name: 'Sofia Rodriguez',
      age: 28,
      nationality: 'Brazilian',
      location: 'Miami, FL',
      photos: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=face'],
      bio: 'Marketing professional who loves salsa dancing and exploring new cultures. Looking for meaningful connections!',
      culturalJourney: 'Growing up in São Paulo, I\'ve always been fascinated by different cultures. Moving to the US opened my eyes to the beauty of cultural exchange.',
      interests: ['Dancing', 'Travel', 'Cooking', 'Music'],
      languages: ['Portuguese', 'English', 'Spanish'],
      compatibility: 92
    },
    {
      id: '2',
      name: 'Priya Sharma',
      age: 26,
      nationality: 'Indian',
      location: 'San Francisco, CA',
      photos: ['https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop&crop=face'],
      bio: 'Software engineer passionate about technology and traditional Indian arts. Love hiking and trying new cuisines.',
      culturalJourney: 'My journey from Mumbai to Silicon Valley has taught me the importance of preserving traditions while embracing innovation.',
      interests: ['Technology', 'Art', 'Hiking', 'Food'],
      languages: ['Hindi', 'English', 'Gujarati'],
      compatibility: 88
    },
    {
      id: '3',
      name: 'Emma Thompson',
      age: 30,
      nationality: 'American',
      location: 'New York, NY',
      photos: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face'],
      bio: 'International relations specialist who speaks 4 languages. Love learning about different cultures and traveling.',
      culturalJourney: 'Working in international diplomacy has shown me how beautiful cultural diversity can be. I\'m excited to learn and share.',
      interests: ['Languages', 'Travel', 'Politics', 'Reading'],
      languages: ['English', 'French', 'Spanish', 'Mandarin'],
      compatibility: 85
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
    
    toast.success(`You liked ${currentProfile.name}! 💕`);
    
    // Simulate match (50% chance)
    if (Math.random() > 0.5) {
      setTimeout(() => {
        toast.success(`It's a match with ${currentProfile.name}! 🎉`);
      }, 1000);
    }
    
    nextProfile();
  };

  const handlePass = () => {
    if (!currentProfile) return;
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
    toast.success('Logged out successfully');
  };

  if (!currentUser || !currentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CulturalConnect
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-blue-600">
                Discover
              </Button>
              <Button variant="ghost" onClick={() => navigate('/feed')}>
                Feed
              </Button>
              <Button variant="ghost" onClick={() => navigate('/messages')}>
                Messages
              </Button>
              <Button variant="ghost" onClick={() => navigate('/events')}>
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
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Button variant="ghost" className="w-full justify-start px-4 py-2">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                    <Button variant="ghost" className="w-full justify-start px-4 py-2" onClick={handleLogout}>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Discover Your Match</h1>
          <p className="text-gray-600">Swipe through profiles and find your cultural connection</p>
        </div>

        {/* Profile Card */}
        <Card className="overflow-hidden shadow-xl">
          {/* Profile Image */}
          <div className="relative h-96">
            <img
              src={currentProfile.photos[0]}
              alt={currentProfile.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <Badge className="bg-green-500 text-white">
                {currentProfile.compatibility}% Match
              </Badge>
            </div>
          </div>

          <CardContent className="p-6">
            {/* Basic Info */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {currentProfile.name}, {currentProfile.age}
              </h2>
              <div className="flex items-center text-gray-600 mb-2">
                <Globe className="h-4 w-4 mr-1" />
                <span>{currentProfile.nationality}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{currentProfile.location}</span>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-4">
              <p className="text-gray-700 leading-relaxed">{currentProfile.bio}</p>
            </div>

            {/* Cultural Journey */}
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Cultural Journey</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{currentProfile.culturalJourney}</p>
            </div>

            {/* Languages */}
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {currentProfile.languages.map((language, index) => (
                  <Badge key={index} variant="outline">
                    {language}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {currentProfile.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <Button
                size="lg"
                variant="outline"
                onClick={handlePass}
                className="rounded-full w-16 h-16 p-0 border-2 border-gray-300 hover:border-red-400 hover:bg-red-50"
              >
                <X className="h-8 w-8 text-gray-600 hover:text-red-500" />
              </Button>
              
              <Button
                size="lg"
                onClick={() => navigate('/messages')}
                className="rounded-full w-16 h-16 p-0 bg-blue-600 hover:bg-blue-700"
              >
                <MessageSquare className="h-8 w-8 text-white" />
              </Button>
              
              <Button
                size="lg"
                onClick={handleLike}
                className="rounded-full w-16 h-16 p-0 bg-pink-500 hover:bg-pink-600"
              >
                <Heart className="h-8 w-8 text-white" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{profileIndex + 1}</div>
            <div className="text-sm text-gray-600">Profile</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">12</div>
            <div className="text-sm text-gray-600">Matches</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">5</div>
            <div className="text-sm text-gray-600">Messages</div>
          </div>
        </div>
      </div>
    </div>
  );
}