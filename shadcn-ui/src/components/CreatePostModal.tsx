import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Image, MapPin, DollarSign, Users, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (post: any) => void;
}

export default function CreatePostModal({ isOpen, onClose, onCreatePost }: CreatePostModalProps) {
  const [postType, setPostType] = useState<'story' | 'event' | 'news'>('story');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [price, setPrice] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');
  const [culturalTheme, setCulturalTheme] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const resetForm = () => {
    setTitle('');
    setContent('');
    setLocation('');
    setDate('');
    setTime('');
    setPrice('');
    setMaxAttendees('');
    setCulturalTheme('');
    setImageUrl('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newPost = {
      id: Date.now().toString(),
      type: postType,
      title,
      content,
      image: imageUrl,
      timestamp: new Date(),
      author: 'You',
      ...(postType === 'event' && {
        location,
        date: date ? new Date(date) : new Date(),
        time,
        price: price ? parseFloat(price) : 0,
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : 50,
        currentAttendees: 0,
        culturalTheme,
      }),
    };

    onCreatePost(newPost);
    toast.success(`${postType === 'event' ? 'Event' : postType === 'story' ? 'Story' : 'Post'} created successfully! 🎉`);
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <span>Create New Post</span>
          </DialogTitle>
          <DialogDescription>
            Share your story, create an event, or post cultural news
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Post Type Selection */}
          <div className="space-y-2">
            <Label>Post Type</Label>
            <Select value={postType} onValueChange={(value: any) => setPostType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="story">📖 Story / Update</SelectItem>
                <SelectItem value="event">🎉 Cultural Event</SelectItem>
                <SelectItem value="news">📰 News / Article</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your post about?"
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts, story, or details..."
              rows={4}
              required
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="image" className="flex items-center">
              <Image className="h-4 w-4 mr-2" />
              Image URL (optional)
            </Label>
            <Input
              id="image"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Event-specific fields */}
          {postType === 'event' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, State or Venue"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="culturalTheme">Cultural Theme</Label>
                  <Input
                    id="culturalTheme"
                    value={culturalTheme}
                    onChange={(e) => setCulturalTheme(e.target.value)}
                    placeholder="e.g., Brazilian, Japanese"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Event Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Event Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Price ($)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxAttendees" className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Max Attendees
                  </Label>
                  <Input
                    id="maxAttendees"
                    type="number"
                    min="1"
                    value={maxAttendees}
                    onChange={(e) => setMaxAttendees(e.target.value)}
                    placeholder="50"
                  />
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Publish Post
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onClose();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
