import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Heart, Send, ArrowLeft, Lightbulb, Globe, UserX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { messageAPI, matchAPI } from '@/lib/api';

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: Date;
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    photos: string[];
  };
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
  isOnline: boolean;
}

interface CurrentUser {
  id: string;
  email: string;
  profileCompleted: boolean;
  token?: string;
}

export default function Messages() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showAIStarters, setShowAIStarters] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // AI conversation starters
  const aiStarters = [
    "I'd love to learn about traditional celebrations in your culture. What's your favorite holiday?",
    "What's one thing about your culture that you think people often misunderstand?",
    "I'm curious about the food from your region. What dish would you recommend I try first?",
    "How has living in a different country changed your perspective on your own culture?",
    "What's a cultural tradition from your background that you'd love to share with someone special?"
  ];

  // Load conversations from backend
  const loadConversations = async () => {
    try {
      setIsLoadingConversations(true);
      const data = await messageAPI.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
      toast.error('Failed to load conversations. Please try again.');
    } finally {
      setIsLoadingConversations(false);
    }
  };

  // Load messages for a conversation
  const loadMessages = async (conversationId: string) => {
    try {
      setIsLoadingMessages(true);
      const data = await messageAPI.getMessages(conversationId);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast.error('Failed to load messages. Please try again.');
    } finally {
      setIsLoadingMessages(false);
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

    // Load conversations from backend
    loadConversations();
  }, [navigate]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const selectedConv = conversations.find(conv => conv.id === selectedConversation);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const message = await messageAPI.sendMessage(selectedConversation, newMessage.trim());

      // Add message to local state
      setMessages(prev => [...prev, message]);

      // Update conversation last message
      setConversations(prev => prev.map(conv => {
        if (conv.id === selectedConversation) {
          return {
            ...conv,
            lastMessage: newMessage,
            lastMessageTime: new Date()
          };
        }
        return conv;
      }));

      setNewMessage('');
      toast.success('Message sent! 💌');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  const handleAIStarter = (starter: string) => {
    setNewMessage(starter);
    setShowAIStarters(false);
  };

  const handleUnmatch = async (matchId: string, name: string) => {
    if (!confirm(`Are you sure you want to unmatch with ${name}? This will delete all messages and you may see each other again in discover.`)) {
      return;
    }

    try {
      await matchAPI.unmatch(matchId);
      setConversations(prev => prev.filter(conv => conv.matchId !== matchId));
      setSelectedConversation(null);
      toast.success(`Unmatched with ${name}. You may see each other again in discover.`);
    } catch (error) {
      console.error('Failed to unmatch:', error);
      toast.error('Failed to unmatch. Please try again.');
    }
  };

  const formatTime = (date: Date | string) => {
    const now = new Date();
    const msgDate = new Date(date);
    const diff = now.getTime() - msgDate.getTime();
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
          {isLoadingConversations ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl mb-4 animate-pulse mx-auto">
                🐝
              </div>
              <p className="text-gray-600">Loading conversations...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-600 mb-4">Start matching with people to begin conversations!</p>
              <Button onClick={() => navigate('/dashboard')} className="bg-blue-600 hover:bg-blue-700">
                Discover Matches
              </Button>
            </div>
          ) : (
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
                              {conversation.isOnline && (
                                <Badge className="ml-2 bg-green-500 text-white text-xs px-1 py-0">
                                  Online
                                </Badge>
                              )}
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
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
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
                {selectedConv?.isOnline && (
                  <span className="ml-2 text-green-500 text-xs">● Online</span>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => selectedConv && handleUnmatch(selectedConv.matchId, selectedConv.name)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            title="Unmatch"
          >
            <UserX className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoadingMessages ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl mb-4 animate-pulse mx-auto">
              🐝
            </div>
            <p className="text-gray-600">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Start the conversation!</h3>
            <p className="text-gray-600 mb-4">Say hi and introduce yourself 👋</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.senderId === currentUser?.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 border'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.senderId === currentUser?.id ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
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