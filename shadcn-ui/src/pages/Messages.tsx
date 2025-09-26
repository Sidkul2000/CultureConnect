import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Heart, Send, ArrowLeft, Lightbulb, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isAI?: boolean;
}

interface Conversation {
  id: string;
  matchId: string;
  name: string;
  photo: string;
  nationality: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
}

interface CurrentUser {
  id: string;
  email: string;
  profileCompleted: boolean;
}

export default function Messages() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showAIStarters, setShowAIStarters] = useState(false);

  // Mock conversations
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      matchId: '1',
      name: 'Sofia Rodriguez',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      nationality: 'Brazilian',
      lastMessage: 'I\'d love to learn more about your culture!',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
      unreadCount: 2,
      messages: [
        {
          id: '1',
          senderId: '1',
          content: 'Hi! I saw we matched. I\'m excited to get to know you!',
          timestamp: new Date(Date.now() - 1000 * 60 * 60)
        },
        {
          id: '2',
          senderId: 'current',
          content: 'Hello Sofia! Nice to meet you. I\'m really interested in Brazilian culture.',
          timestamp: new Date(Date.now() - 1000 * 60 * 45)
        },
        {
          id: '3',
          senderId: '1',
          content: 'That\'s wonderful! I\'d love to learn more about your culture too!',
          timestamp: new Date(Date.now() - 1000 * 60 * 30)
        }
      ]
    },
    {
      id: '2',
      matchId: '2',
      name: 'Priya Sharma',
      photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face',
      nationality: 'Indian',
      lastMessage: 'Would you like to try some Indian cuisine together?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
      unreadCount: 0,
      messages: [
        {
          id: '1',
          senderId: '2',
          content: 'Hello! I noticed you\'re interested in different cultures. I\'d love to share some Indian traditions with you.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3)
        },
        {
          id: '2',
          senderId: 'current',
          content: 'That sounds amazing! I\'ve always wanted to learn more about Indian culture.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5)
        },
        {
          id: '3',
          senderId: '2',
          content: 'Would you like to try some Indian cuisine together?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
        }
      ]
    }
  ]);

  // AI conversation starters
  const aiStarters = [
    "I'd love to learn about traditional celebrations in your culture. What's your favorite holiday?",
    "What's one thing about your culture that you think people often misunderstand?",
    "I'm curious about the food from your region. What dish would you recommend I try first?",
    "How has living in a different country changed your perspective on your own culture?",
    "What's a cultural tradition from your background that you'd love to share with someone special?"
  ];

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/auth');
      return;
    }
    setCurrentUser(JSON.parse(user) as CurrentUser);
  }, [navigate]);

  const selectedConv = conversations.find(conv => conv.id === selectedConversation);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'current',
      content: newMessage,
      timestamp: new Date()
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedConversation) {
        return {
          ...conv,
          messages: [...conv.messages, message],
          lastMessage: newMessage,
          lastMessageTime: new Date()
        };
      }
      return conv;
    }));

    setNewMessage('');
    toast.success('Message sent!');

    // Simulate response after 2 seconds
    setTimeout(() => {
      const responses = [
        "That's really interesting! Tell me more.",
        "I love learning about different perspectives!",
        "That sounds wonderful. I'd love to experience that.",
        "Thank you for sharing that with me!",
        "Your culture sounds so rich and beautiful."
      ];
      
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: selectedConv?.matchId || '1',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };

      setConversations(prev => prev.map(conv => {
        if (conv.id === selectedConversation) {
          return {
            ...conv,
            messages: [...conv.messages, response],
            lastMessage: response.content,
            lastMessageTime: new Date(),
            unreadCount: conv.unreadCount + 1
          };
        }
        return conv;
      }));
    }, 2000);
  };

  const handleAIStarter = (starter: string) => {
    setNewMessage(starter);
    setShowAIStarters(false);
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

  if (!selectedConversation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Messages
              </span>
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="max-w-2xl mx-auto py-6 px-4">
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <Card 
                key={conversation.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={conversation.photo}
                        alt={conversation.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {conversation.unreadCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{conversation.name}</h3>
                          <div className="flex items-center text-sm text-gray-500 mb-1">
                            <Globe className="h-3 w-3 mr-1" />
                            <span>{conversation.nationality}</span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.lastMessageTime)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {conversations.length === 0 && (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-600 mb-4">Start matching with people to begin conversations!</p>
              <Button onClick={() => navigate('/dashboard')} className="bg-blue-600 hover:bg-blue-700">
                Discover Matches
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => setSelectedConversation(null)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <img
            src={selectedConv?.photo}
            alt={selectedConv?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="font-semibold text-gray-900">{selectedConv?.name}</h2>
            <div className="flex items-center text-sm text-gray-500">
              <Globe className="h-3 w-3 mr-1" />
              <span>{selectedConv?.nationality}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedConv?.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === 'current' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.senderId === 'current'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-900 border'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.senderId === 'current' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* AI Conversation Starters */}
      {showAIStarters && (
        <div className="bg-yellow-50 border-t border-yellow-200 p-4">
          <div className="flex items-center mb-3">
            <Lightbulb className="h-5 w-5 text-yellow-600 mr-2" />
            <span className="font-semibold text-yellow-800">AI Conversation Starters</span>
          </div>
          <div className="space-y-2">
            {aiStarters.map((starter, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-left h-auto p-2 w-full justify-start text-wrap"
                onClick={() => handleAIStarter(starter)}
              >
                {starter}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAIStarters(!showAIStarters)}
            className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
          >
            <Lightbulb className="h-4 w-4 mr-1" />
            AI Starters
          </Button>
        </div>
        
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}