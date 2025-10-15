import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User, MapPin, Globe, Heart, MessageSquare, Calendar,
  Sparkles, ArrowLeft, Users, TrendingUp, PartyPopper, Newspaper, Trash2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { userAPI, postAPI } from '@/lib/api';

interface ProfileData {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    bio?: string;
    culturalJourney?: string;
    photos: string[];
    interests: string[];
    languages: string[];
    nationality?: string;
    location?: string;
    isOnline: boolean;
    createdAt: Date;
  };
  stats: {
    posts: number;
    matches: number;
    likesReceived: number;
  };
  posts: Array<{
    id: string;
    type: string;
    title: string;
    content: string;
    image?: string;
    location?: string;
    culturalTheme?: string;
    createdAt: Date;
    eventDetails?: {
      date: Date;
      time: string;
      address?: string;
      price: number;
      maxAttendees: number;
    };
    _count: {
      likes: number;
      comments: number;
    };
  }>;
}

export default function Profile() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId?: string }>();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get current user ID
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUserId(user.id);
    }

    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const targetUserId = userId || 'me';
        const data = await userAPI.getProfile(targetUserId);
        setProfileData(data);
      } catch (error) {
        console.error('Failed to load profile:', error);
        toast.error('Failed to load profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post/event/story?')) {
      return;
    }

    try {
      await postAPI.deletePost(postId);
      // Remove post from local state
      setProfileData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          posts: prev.posts.filter(p => p.id !== postId),
          stats: {
            ...prev.stats,
            posts: prev.stats.posts - 1
          }
        };
      });
      toast.success('Deleted successfully');
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast.error('Failed to delete. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-yellow-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">Profile not found</p>
            <Button onClick={() => navigate('/dashboard')} className="mt-4">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { user, stats, posts } = profileData;
  const fullName = `${user.firstName} ${user.lastName}`;
  const profilePhoto = user.photos?.[0] || '';
  const isOwnProfile = !userId || userId === 'me' || user.id === currentUserId;

  const getPostIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'event':
        return <PartyPopper className="h-4 w-4" />;
      case 'news':
        return <Newspaper className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Profile
          </h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <Avatar className="h-32 w-32 border-4 border-yellow-400">
                  <AvatarImage src={profilePhoto} alt={fullName} />
                  <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-3xl">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                {user.isOnline && (
                  <Badge className="mt-2 bg-green-500">
                    <span className="mr-1">●</span> Online
                  </Badge>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{fullName}</h2>
                    <div className="flex flex-wrap gap-3 text-gray-600">
                      {user.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{user.location}</span>
                        </div>
                      )}
                      {user.nationality && (
                        <div className="flex items-center gap-1">
                          <Globe className="h-4 w-4" />
                          <span>{user.nationality}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{stats.posts}</div>
                      <div className="text-sm text-gray-600">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{stats.matches}</div>
                      <div className="text-sm text-gray-600">Matches</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-500">{stats.likesReceived}</div>
                      <div className="text-sm text-gray-600">Likes</div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {user.bio && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      About
                    </h3>
                    <p className="text-gray-700">{user.bio}</p>
                  </div>
                )}

                {/* Cultural Journey */}
                {user.culturalJourney && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Cultural Journey
                    </h3>
                    <p className="text-gray-700">{user.culturalJourney}</p>
                  </div>
                )}

                {/* Interests & Languages */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.interests && user.interests.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {user.interests.map((interest, idx) => (
                          <Badge key={idx} variant="secondary">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {user.languages && user.languages.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Languages</h3>
                      <div className="flex flex-wrap gap-2">
                        {user.languages.map((language, idx) => (
                          <Badge key={idx} variant="outline">
                            {language}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Posts & Activity
            </CardTitle>
            <CardDescription>
              {posts.length === 0
                ? 'No posts yet'
                : `${posts.length} post${posts.length === 1 ? '' : 's'}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {posts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No posts yet. Start sharing your story!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {/* Post Image */}
                        {post.image && (
                          <div className="md:w-1/3">
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-48 md:h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Post Content */}
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getPostIcon(post.type)}
                              <Badge variant="secondary">
                                {post.type}
                              </Badge>
                              {post.culturalTheme && (
                                <Badge variant="outline">
                                  {post.culturalTheme}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">
                                {formatDate(post.createdAt)}
                              </span>
                              {isOwnProfile && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeletePost(post.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  title="Delete post"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>

                          <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                          <p className="text-gray-700 mb-3 line-clamp-2">{post.content}</p>

                          {/* Event Details */}
                          {post.eventDetails && (
                            <div className="bg-yellow-50 p-3 rounded-lg mb-3 space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {formatDate(post.eventDetails.date)} at {post.eventDetails.time}
                                </span>
                              </div>
                              {post.location && (
                                <div className="flex items-center gap-2 text-sm">
                                  <MapPin className="h-4 w-4" />
                                  <span>{post.location}</span>
                                </div>
                              )}
                              {post.eventDetails.price > 0 && (
                                <div className="text-sm font-semibold text-green-600">
                                  ${post.eventDetails.price}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Post Stats */}
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              <span>{post._count.likes} likes</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>{post._count.comments} comments</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
