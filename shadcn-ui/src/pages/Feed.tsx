import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, ArrowLeft, Calendar, MapPin, Users, ExternalLink, Globe, Newspaper, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FeedItem {
  id: string;
  type: 'event' | 'news' | 'user_post' | 'sponsored';
  title: string;
  content: string;
  image?: string;
  author?: string;
  timestamp: Date;
  location?: string;
  attendees?: number;
  price?: number;
  culturalTheme?: string;
  link?: string;
}

interface CurrentUser {
  id: string;
  email: string;
  profileCompleted: boolean;
}

export default function Feed() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock feed data
  const feedItems: FeedItem[] = [
    {
      id: '1',
      type: 'event',
      title: 'Brazilian Carnival Night',
      content: 'Join us for an authentic Brazilian Carnival celebration with live samba music, traditional food, and dancing lessons!',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=200&fit=crop',
      timestamp: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      location: 'Miami, FL',
      attendees: 45,
      price: 25,
      culturalTheme: 'Brazilian'
    },
    {
      id: '2',
      type: 'news',
      title: 'New H1B Visa Updates for 2024',
      content: 'Important changes to the H1B visa application process that could affect international professionals seeking to work in the US.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      link: '#'
    },
    {
      id: '3',
      type: 'user_post',
      title: 'Cultural Exchange Success Story',
      content: 'Maria from Mexico and John from Texas share their beautiful cross-cultural love story and how they navigated cultural differences.',
      author: 'CulturalConnect Team',
      image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=200&fit=crop',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6)
    },
    {
      id: '4',
      type: 'event',
      title: 'German Oktoberfest Celebration',
      content: 'Experience authentic German culture with traditional beer, bratwurst, and live folk music. Lederhosen optional but encouraged!',
      image: 'https://images.unsplash.com/photo-1758388554854-e4761f591414?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      timestamp: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      location: 'Chicago, IL',
      attendees: 32,
      price: 30,
      culturalTheme: 'German'
    },
    {
      id: '5',
      type: 'sponsored',
      title: 'Immigration Law Consultation',
      content: 'Get expert advice on visa applications, green card processes, and citizenship requirements from certified immigration attorneys.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      link: '#'
    },
    {
      id: '6',
      type: 'event',
      title: 'Holi Festival of Colors',
      content: 'Celebrate the Indian festival of Holi with colors, traditional sweets, and Bollywood music. All are welcome to join this joyful celebration!',
      image: 'https://images.unsplash.com/photo-1603228254119-e6a4d095dc59?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      timestamp: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      location: 'San Francisco, CA',
      attendees: 67,
      price: 15,
      culturalTheme: 'Indian'
    },
    {
      id: '7',
      type: 'news',
      title: 'Cultural Fun Fact: Did You Know?',
      content: 'In Japan, it\'s considered polite to slurp your noodles as it shows appreciation for the meal and helps cool down the food.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4)
    }
  ];

  const filters = [
    { id: 'all', label: 'All', icon: Globe },
    { id: 'event', label: 'Events', icon: Calendar },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'user_post', label: 'Stories', icon: Users },
    { id: 'sponsored', label: 'Services', icon: Star }
  ];

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/auth');
      return;
    }
    setCurrentUser(JSON.parse(user) as CurrentUser);
  }, [navigate]);

  const filteredItems = selectedFilter === 'all' 
    ? feedItems 
    : feedItems.filter(item => item.type === selectedFilter);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const absDiff = Math.abs(diff);
    const minutes = Math.floor(absDiff / (1000 * 60));
    const hours = Math.floor(absDiff / (1000 * 60 * 60));
    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));

    if (diff > 0) {
      // Future date
      if (days > 0) return `in ${days} day${days > 1 ? 's' : ''}`;
      if (hours > 0) return `in ${hours} hour${hours > 1 ? 's' : ''}`;
      return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      // Past date
      if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
      if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'event': return <Calendar className="h-5 w-5 text-blue-600" />;
      case 'news': return <Newspaper className="h-5 w-5 text-green-600" />;
      case 'user_post': return <Users className="h-5 w-5 text-purple-600" />;
      case 'sponsored': return <Star className="h-5 w-5 text-yellow-600" />;
      default: return <Globe className="h-5 w-5 text-gray-600" />;
    }
  };

  const getItemColor = (type: string) => {
    switch (type) {
      case 'event': return 'border-l-blue-500';
      case 'news': return 'border-l-green-500';
      case 'user_post': return 'border-l-purple-500';
      case 'sponsored': return 'border-l-yellow-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 sticky top-0 z-50">
        <div className="flex items-center space-x-4 mb-4">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Cultural Feed
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 overflow-x-auto">
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <Button
                key={filter.id}
                variant={selectedFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter.id)}
                className="flex items-center space-x-1 whitespace-nowrap"
              >
                <Icon className="h-4 w-4" />
                <span>{filter.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Feed Content */}
      <div className="max-w-2xl mx-auto py-6 px-4">
        <div className="space-y-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className={`border-l-4 ${getItemColor(item.type)} hover:shadow-md transition-shadow`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getItemIcon(item.type)}
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription className="flex items-center space-x-2">
                        <span>{formatTime(item.timestamp)}</span>
                        {item.author && (
                          <>
                            <span>•</span>
                            <span>{item.author}</span>
                          </>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  {item.type === 'sponsored' && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Sponsored
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                {item.image && (
                  <div className="mb-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                <p className="text-gray-700 mb-4 leading-relaxed">{item.content}</p>

                {/* Event-specific details */}
                {item.type === 'event' && (
                  <div className="space-y-2 mb-4">
                    {item.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{item.location}</span>
                      </div>
                    )}
                    {item.attendees && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{item.attendees} people interested</span>
                      </div>
                    )}
                    {item.culturalTheme && (
                      <Badge variant="outline" className="text-xs">
                        {item.culturalTheme} Culture
                      </Badge>
                    )}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex space-x-2">
                  {item.type === 'event' && (
                    <>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        RSVP {item.price && `- $${item.price}`}
                      </Button>
                      <Button size="sm" variant="outline">
                        Learn More
                      </Button>
                    </>
                  )}
                  
                  {(item.type === 'news' || item.type === 'sponsored') && item.link && (
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Read More
                    </Button>
                  )}
                  
                  {item.type === 'user_post' && (
                    <Button size="sm" variant="outline">
                      <Heart className="h-4 w-4 mr-1" />
                      Like Story
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No content found</h3>
            <p className="text-gray-600 mb-4">Try selecting a different filter to see more content.</p>
            <Button onClick={() => setSelectedFilter('all')} variant="outline">
              Show All Content
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}