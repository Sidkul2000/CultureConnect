import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, ArrowLeft, Calendar, MapPin, Users, Clock, DollarSign, Search, Sparkles, Coffee, PartyPopper } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Event {
  id: string;
  title: string;
  description: string;
  culturalTheme: string;
  date: Date;
  time: string;
  location: string;
  address: string;
  price: number;
  maxAttendees: number;
  currentAttendees: number;
  image: string;
  organizer: string;
  tags: string[];
  rsvpStatus?: 'pending' | 'confirmed' | 'declined';
  emoji: string;
}

interface CurrentUser {
  id: string;
  email: string;
  profileCompleted: boolean;
}

export default function Events() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Mock events data with H1bee branding and warmer content
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Brazilian Carnival Night 🎭',
      description: 'Get ready to samba! Experience the vibrant energy of Brazilian Carnival with authentic music, colorful costumes, and amazing Brazilian food. Our professional dancers will teach you basic samba steps - no experience needed, just bring your energy! 💃🕺',
      culturalTheme: 'Brazilian',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      time: '7:00 PM - 11:00 PM',
      location: 'Miami Cultural Center',
      address: '101 W Flagler St, Miami, FL 33130',
      price: 25,
      maxAttendees: 100,
      currentAttendees: 45,
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&h=300&fit=crop',
      organizer: 'H1bee Miami Community',
      tags: ['Dancing', 'Live Music', 'Brazilian Food', 'Costumes', 'Beginner Friendly'],
      rsvpStatus: 'pending',
      emoji: '🇧🇷'
    },
    {
      id: '2',
      title: 'Gemütlich Oktoberfest 🍺',
      description: 'Prost! Join us for an authentic German Oktoberfest with traditional beer, bratwurst, giant pretzels, and live folk music. Wear your lederhosen and dirndl for extra fun! We\'ll have German language games and cultural trivia too! 🥨',
      culturalTheme: 'German',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      time: '6:00 PM - 10:00 PM',
      location: 'Chicago German Club',
      address: '4248 N Lincoln Ave, Chicago, IL 60618',
      price: 30,
      maxAttendees: 80, 
      currentAttendees: 32,
      image: 'https://images.unsplash.com/photo-1758388554854-e4761f591414?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      organizer: 'German-American H1bee Group',
      tags: ['Beer Tasting', 'Folk Music', 'German Food', 'Traditional Games', 'Language Exchange'],
      rsvpStatus: 'pending',
      emoji: '🇩🇪'
    },
    {
      id: '3',
      title: 'Holi Festival of Colors 🌈',
      description: 'Celebrate spring and new beginnings with the joyful Indian festival of Holi! Throw colorful powders, dance to Bollywood beats, enjoy delicious Indian sweets, and make new friends. All colors and clothes will be provided! ✨',
      culturalTheme: 'Indian',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      time: '2:00 PM - 6:00 PM',
      location: 'Golden Gate Park',
      address: 'Golden Gate Park, San Francisco, CA 94117',
      price: 15,
      maxAttendees: 150,
      currentAttendees: 67,
      image: 'https://images.unsplash.com/photo-1603228254119-e6a4d095dc59?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      organizer: 'Bay Area H1bee Indian Community',
      tags: ['Color Festival', 'Bollywood Dancing', 'Indian Sweets', 'Cultural Stories', 'Photography'],
      rsvpStatus: 'pending',
      emoji: '🇮🇳'
    },
    {
      id: '4',
      title: 'Zen Tea Ceremony Experience 🍵',
      description: 'Find your inner peace in this authentic Japanese tea ceremony workshop. Learn the meditative art of tea preparation, discover Japanese philosophy, and enjoy traditional wagashi sweets. Perfect for mindful connections! 🧘‍♀️',
      culturalTheme: 'Japanese',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
      time: '3:00 PM - 5:00 PM',
      location: 'Japanese Cultural Center',
      address: '244 S San Pedro St, Los Angeles, CA 90012',
      price: 20,
      maxAttendees: 25,
      currentAttendees: 18,
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&h=300&fit=crop',
      organizer: 'LA H1bee Japanese Cultural Circle',
      tags: ['Tea Ceremony', 'Meditation', 'Japanese Sweets', 'Mindfulness', 'Small Group'],
      rsvpStatus: 'pending',
      emoji: '🇯🇵'
    },
    {
      id: '5',
      title: 'Día de los Muertos Celebration 💀',
      description: 'Honor Mexican tradition with this beautiful celebration of life and remembrance! Create colorful altars, enjoy authentic Mexican food, dance to mariachi music, and get your face painted. A joyful celebration of culture and community! 🎨',
      culturalTheme: 'Mexican',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21),
      time: '5:00 PM - 9:00 PM',
      location: 'Austin Community Center',
      address: '2417 Rosewood Ave, Austin, TX 78702',
      price: 18,
      maxAttendees: 120,
      currentAttendees: 28,
      image: 'https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?w=500&h=300&fit=crop',
      organizer: 'Austin H1bee Mexican Heritage Group',
      tags: ['Cultural Art', 'Mariachi Music', 'Mexican Food', 'Face Painting', 'Community Celebration'],
      rsvpStatus: 'pending',
      emoji: '🇲🇽'
    }
  ]);

  const culturalThemes = ['all', 'Brazilian', 'German', 'Indian', 'Japanese', 'Mexican', 'Chinese', 'Italian', 'French'];

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/auth');
      return;
    }
    setCurrentUser(JSON.parse(user) as CurrentUser);
  }, [navigate]);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.culturalTheme.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTheme = selectedTheme === 'all' || event.culturalTheme === selectedTheme;
    return matchesSearch && matchesTheme;
  });

  const handleRSVP = (eventId: string, status: 'confirmed' | 'declined') => {
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        const attendeeChange = status === 'confirmed' ? 1 : (event.rsvpStatus === 'confirmed' ? -1 : 0);
        return {
          ...event,
          rsvpStatus: status,
          currentAttendees: Math.max(0, event.currentAttendees + attendeeChange)
        };
      }
      return event;
    }));

    if (status === 'confirmed') {
      toast.success('Amazing! You\'re going! 🎉', {
        description: "Can't wait to see you there! Check your email for event details."
      });
    } else {
      toast.info('No worries! Maybe next time! 😊', {
        description: "We'll let you know about similar events in the future."
      });
    }
    setSelectedEvent(null);
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const getAvailabilityColor = (current: number, max: number) => {
    const ratio = current / max;
    if (ratio < 0.5) return 'text-green-600';
    if (ratio < 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (selectedEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50">
        {/* Header */}
        <div className="glass-morphism border-b border-white/20 p-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => setSelectedEvent(null)} className="hover:bg-yellow-50">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <Calendar className="h-6 w-6 text-yellow-500" />
              <span className="text-xl font-bold text-gray-900">Event Details</span>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="max-w-2xl mx-auto py-6 px-4">
          <Card className="overflow-hidden shadow-2xl border-0 bg-white">
            <div className="relative h-64">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold px-3 py-1">
                  {selectedEvent.culturalTheme} {selectedEvent.emoji}
                </Badge>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>

            <CardHeader>
              <CardTitle className="text-2xl font-bold">{selectedEvent.title}</CardTitle>
              <CardDescription className="text-lg">Organized by {selectedEvent.organizer} 💛</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <p className="text-gray-700 leading-relaxed text-lg">{selectedEvent.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center text-gray-700 p-3 bg-yellow-50 rounded-lg">
                    <Calendar className="h-5 w-5 mr-3 text-yellow-600" />
                    <div>
                      <div className="font-bold">{formatDate(selectedEvent.date)}</div>
                      <div className="text-sm">{selectedEvent.time}</div>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-700 p-3 bg-pink-50 rounded-lg">
                    <MapPin className="h-5 w-5 mr-3 text-pink-600" />
                    <div>
                      <div className="font-bold">{selectedEvent.location}</div>
                      <div className="text-sm">{selectedEvent.address}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-gray-700 p-3 bg-green-50 rounded-lg">
                    <DollarSign className="h-5 w-5 mr-3 text-green-600" />
                    <div>
                      <div className="font-bold">${selectedEvent.price}</div>
                      <div className="text-sm">Per person (includes everything!)</div>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-700 p-3 bg-purple-50 rounded-lg">
                    <Users className="h-5 w-5 mr-3 text-purple-600" />
                    <div>
                      <div className={`font-bold ${getAvailabilityColor(selectedEvent.currentAttendees, selectedEvent.maxAttendees)}`}>
                        {selectedEvent.currentAttendees} / {selectedEvent.maxAttendees}
                      </div>
                      <div className="text-sm">H1bee members attending</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-yellow-600" />
                  What to Expect
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.tags.map((tag, index) => (
                    <Badge key={index} className="bg-white text-gray-700 border border-yellow-300 hover:bg-yellow-100">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                {selectedEvent.rsvpStatus === 'pending' ? (
                  <>
                    <Button
                      onClick={() => handleRSVP(selectedEvent.id, 'confirmed')}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 shadow-lg"
                      disabled={selectedEvent.currentAttendees >= selectedEvent.maxAttendees}
                    >
                      <PartyPopper className="h-4 w-4 mr-2" />
                      I'm Going! - ${selectedEvent.price}
                    </Button>
                    <Button
                      onClick={() => handleRSVP(selectedEvent.id, 'declined')}
                      variant="outline"
                      className="flex-1 border-gray-300 hover:bg-gray-50"
                    >
                      Can't Make It 😔
                    </Button>
                  </>
                ) : selectedEvent.rsvpStatus === 'confirmed' ? (
                  <div className="flex-1 text-center">
                    <Badge className="bg-green-100 text-green-800 text-lg py-3 px-6 font-bold">
                      🎉 You're Going! See you there!
                    </Badge>
                    <Button
                      onClick={() => handleRSVP(selectedEvent.id, 'declined')}
                      variant="outline"
                      size="sm"
                      className="ml-4 hover:bg-red-50"
                    >
                      Cancel RSVP
                    </Button>
                  </div>
                ) : (
                  <div className="flex-1 text-center">
                    <Badge variant="outline" className="text-lg py-3 px-6">
                      RSVP Declined
                    </Badge>
                    <Button
                      onClick={() => handleRSVP(selectedEvent.id, 'confirmed')}
                      variant="outline"
                      size="sm"
                      className="ml-4 hover:bg-green-50"
                      disabled={selectedEvent.currentAttendees >= selectedEvent.maxAttendees}
                    >
                      Changed My Mind!
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="glass-morphism border-b border-white/20 p-4 sticky top-0 z-50">
        <div className="flex items-center space-x-4 mb-4">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="hover:bg-yellow-50">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-lg">
              🐝
            </div>
            <span className="text-xl font-bold h1bee-text-gradient">
              Cultural Events & Meetups
            </span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search events, cultures, activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
            />
          </div>
          <Select value={selectedTheme} onValueChange={setSelectedTheme}>
            <SelectTrigger className="w-full sm:w-48 border-gray-200 focus:border-yellow-400">
              <SelectValue placeholder="Cultural Theme" />
            </SelectTrigger>
            <SelectContent>
              {culturalThemes.map((theme) => (
                <SelectItem key={theme} value={theme}>
                  {theme === 'all' ? '🌍 All Cultures' : `${theme} Culture`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Events List */}
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Amazing Cultural Events</h1>
          <p className="text-gray-600 text-lg">Connect with your community through shared cultural experiences! 🌟</p>
        </div>

        <div className="grid gap-6">
          {filteredEvents.map((event) => (
            <Card 
              key={event.id}
              className="cursor-pointer card-hover overflow-hidden border-0 shadow-lg bg-white"
              onClick={() => setSelectedEvent(event)}
            >
              <div className="md:flex">
                <div className="md:w-1/3 relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold px-3 py-1">
                      {event.culturalTheme} {event.emoji}
                    </Badge>
                  </div>
                  {event.rsvpStatus === 'confirmed' && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-500 text-white font-bold px-3 py-1">
                        🎉 Going!
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="md:w-2/3 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">{event.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-yellow-500" />
                      <span className="font-medium">{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-blue-500" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-pink-500" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                      <span className="font-medium">${event.price}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-purple-500" />
                      <span className={`font-medium ${getAvailabilityColor(event.currentAttendees, event.maxAttendees)}`}>
                        {event.currentAttendees} / {event.maxAttendees} H1bees attending
                      </span>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold">
                      <Coffee className="h-4 w-4 mr-1" />
                      Join Event
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎭</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No events found</h3>
            <p className="text-gray-600 mb-6 text-lg">
              {searchQuery || selectedTheme !== 'all' 
                ? 'Try adjusting your search or filters to discover more events!'
                : 'Check back soon for exciting cultural events in your area! 🌟'
              }
            </p>
            {(searchQuery || selectedTheme !== 'all') && (
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTheme('all');
                }} 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Show All Events
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}