import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, ArrowLeft, Calendar, MapPin, Users, Clock, DollarSign, Search } from 'lucide-react';
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

  // Mock events data
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Brazilian Carnival Night',
      description: 'Experience the vibrant energy of Brazilian Carnival with authentic samba music, traditional costumes, and delicious Brazilian cuisine. Learn basic samba steps from professional dancers and immerse yourself in the rich culture of Brazil.',
      culturalTheme: 'Brazilian',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      time: '7:00 PM - 11:00 PM',
      location: 'Miami Cultural Center',
      address: '101 W Flagler St, Miami, FL 33130',
      price: 25,
      maxAttendees: 100,
      currentAttendees: 45,
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&h=300&fit=crop',
      organizer: 'CulturalConnect Miami',
      tags: ['Dancing', 'Music', 'Food', 'Costumes'],
      rsvpStatus: 'pending'
    },
    {
      id: '2',
      title: 'German Oktoberfest Celebration',
      description: 'Join us for an authentic German Oktoberfest experience complete with traditional beer, bratwurst, pretzels, and live folk music. Wear your lederhosen and dirndl for the full experience!',
      culturalTheme: 'German',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      time: '6:00 PM - 10:00 PM',
      location: 'Chicago German Club',
      address: '4248 N Lincoln Ave, Chicago, IL 60618',
      price: 30,
      maxAttendees: 80,
      currentAttendees: 32,
      image: 'https://images.unsplash.com/photo-1544378730-6b0e5b7e9b82?w=500&h=300&fit=crop',
      organizer: 'German-American Society',
      tags: ['Beer', 'Music', 'Food', 'Traditional'],
      rsvpStatus: 'pending'
    },
    {
      id: '3',
      title: 'Holi Festival of Colors',
      description: 'Celebrate the Indian festival of Holi with vibrant colors, traditional sweets, Bollywood music, and cultural performances. All are welcome to join this joyful celebration of spring and new beginnings.',
      culturalTheme: 'Indian',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      time: '2:00 PM - 6:00 PM',
      location: 'Golden Gate Park',
      address: 'Golden Gate Park, San Francisco, CA 94117',
      price: 15,
      maxAttendees: 150,
      currentAttendees: 67,
      image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&h=300&fit=crop',
      organizer: 'Bay Area Indian Community',
      tags: ['Colors', 'Music', 'Sweets', 'Festival'],
      rsvpStatus: 'pending'
    },
    {
      id: '4',
      title: 'Japanese Tea Ceremony Workshop',
      description: 'Learn the ancient art of Japanese tea ceremony in this hands-on workshop. Discover the philosophy behind this meditative practice and enjoy traditional Japanese sweets.',
      culturalTheme: 'Japanese',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
      time: '3:00 PM - 5:00 PM',
      location: 'Japanese Cultural Center',
      address: '244 S San Pedro St, Los Angeles, CA 90012',
      price: 20,
      maxAttendees: 25,
      currentAttendees: 18,
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&h=300&fit=crop',
      organizer: 'LA Japanese Cultural Society',
      tags: ['Tea', 'Meditation', 'Traditional', 'Workshop'],
      rsvpStatus: 'pending'
    },
    {
      id: '5',
      title: 'Mexican Día de los Muertos Celebration',
      description: 'Honor the Mexican tradition of Día de los Muertos with altar displays, traditional food, mariachi music, and face painting. Learn about this beautiful celebration of life and remembrance.',
      culturalTheme: 'Mexican',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21),
      time: '5:00 PM - 9:00 PM',
      location: 'Austin Community Center',
      address: '2417 Rosewood Ave, Austin, TX 78702',
      price: 18,
      maxAttendees: 120,
      currentAttendees: 28,
      image: 'https://images.unsplash.com/photo-1509773896068-7fd415d91e2e?w=500&h=300&fit=crop',
      organizer: 'Austin Mexican Heritage Society',
      tags: ['Tradition', 'Music', 'Art', 'Food'],
      rsvpStatus: 'pending'
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

    toast.success(status === 'confirmed' ? 'RSVP confirmed! See you there!' : 'RSVP declined');
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => setSelectedEvent(null)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Event Details</span>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="max-w-2xl mx-auto py-6 px-4">
          <Card className="overflow-hidden">
            <div className="relative h-64">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-blue-600 text-white">
                  {selectedEvent.culturalTheme}
                </Badge>
              </div>
            </div>

            <CardHeader>
              <CardTitle className="text-2xl">{selectedEvent.title}</CardTitle>
              <CardDescription>Organized by {selectedEvent.organizer}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <p className="text-gray-700 leading-relaxed">{selectedEvent.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-3" />
                    <div>
                      <div className="font-semibold">{formatDate(selectedEvent.date)}</div>
                      <div className="text-sm">{selectedEvent.time}</div>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-3" />
                    <div>
                      <div className="font-semibold">{selectedEvent.location}</div>
                      <div className="text-sm">{selectedEvent.address}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="h-5 w-5 mr-3" />
                    <div>
                      <div className="font-semibold">${selectedEvent.price}</div>
                      <div className="text-sm">Per person</div>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-3" />
                    <div>
                      <div className={`font-semibold ${getAvailabilityColor(selectedEvent.currentAttendees, selectedEvent.maxAttendees)}`}>
                        {selectedEvent.currentAttendees} / {selectedEvent.maxAttendees}
                      </div>
                      <div className="text-sm">Attendees</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What to Expect</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
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
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={selectedEvent.currentAttendees >= selectedEvent.maxAttendees}
                    >
                      RSVP Yes - ${selectedEvent.price}
                    </Button>
                    <Button
                      onClick={() => handleRSVP(selectedEvent.id, 'declined')}
                      variant="outline"
                      className="flex-1"
                    >
                      Can't Make It
                    </Button>
                  </>
                ) : selectedEvent.rsvpStatus === 'confirmed' ? (
                  <div className="flex-1 text-center">
                    <Badge className="bg-green-100 text-green-800 text-lg py-2 px-4">
                      ✓ You're Going!
                    </Badge>
                    <Button
                      onClick={() => handleRSVP(selectedEvent.id, 'declined')}
                      variant="outline"
                      size="sm"
                      className="ml-4"
                    >
                      Cancel RSVP
                    </Button>
                  </div>
                ) : (
                  <div className="flex-1 text-center">
                    <Badge variant="outline" className="text-lg py-2 px-4">
                      RSVP Declined
                    </Badge>
                    <Button
                      onClick={() => handleRSVP(selectedEvent.id, 'confirmed')}
                      variant="outline"
                      size="sm"
                      className="ml-4"
                      disabled={selectedEvent.currentAttendees >= selectedEvent.maxAttendees}
                    >
                      Change Mind
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
              Cultural Events
            </span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedTheme} onValueChange={setSelectedTheme}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Cultural Theme" />
            </SelectTrigger>
            <SelectContent>
              {culturalThemes.map((theme) => (
                <SelectItem key={theme} value={theme}>
                  {theme === 'all' ? 'All Cultures' : theme}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Events List */}
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="grid gap-6">
          {filteredEvents.map((event) => (
            <Card 
              key={event.id}
              className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
              onClick={() => setSelectedEvent(event)}
            >
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className="bg-blue-100 text-blue-800">
                      {event.culturalTheme}
                    </Badge>
                    {event.rsvpStatus === 'confirmed' && (
                      <Badge className="bg-green-100 text-green-800">
                        Going
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span>${event.price}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      <span className={getAvailabilityColor(event.currentAttendees, event.maxAttendees)}>
                        {event.currentAttendees} / {event.maxAttendees} attending
                      </span>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || selectedTheme !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Check back soon for upcoming cultural events!'
              }
            </p>
            {(searchQuery || selectedTheme !== 'all') && (
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTheme('all');
                }} 
                variant="outline"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}