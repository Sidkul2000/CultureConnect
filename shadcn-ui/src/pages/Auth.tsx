import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, ArrowLeft, Sparkles, Globe, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Auth() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    userType: '',
    nationality: '',
    gender: '',
    orientation: '',
    relationshipGoal: '',
    zipCode: ''
  });

  const nationalities = [
    'Brazilian', 'Mexican', 'Indian', 'Chinese', 'German', 'French', 'Italian', 'Japanese',
    'Korean', 'Russian', 'Canadian', 'British', 'Australian', 'Spanish', 'Portuguese',
    'Dutch', 'Swedish', 'Norwegian', 'Polish', 'Turkish', 'Egyptian', 'Nigerian', 'Other'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp) {
      // Validation
      if (!formData.email || !formData.password || !formData.userType || !formData.gender) {
        toast.error('Please fill in all required fields 📝');
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match 🔐');
        return;
      }

      if (formData.userType === 'non_american' && !formData.nationality) {
        toast.error('Please select your nationality 🌍');
        return;
      }

      // Store user data in localStorage for MVP
      const userData = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('currentUser', JSON.stringify(userData));
      toast.success('Welcome to the H1bee family! 🐝✨', {
        description: "Let's set up your profile and start connecting!"
      });
      navigate('/profile-setup');
    } else {
      // Login logic
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.email === formData.email && user.password === formData.password) {
          toast.success('Welcome back to H1bee! 🐝💛', {
            description: "Ready to make some amazing connections?"
          });
          navigate('/dashboard');
        } else {
          toast.error('Hmm, those credentials don\'t look right 🤔');
        }
      } else {
        toast.error('No account found. Join the H1bee community first! 🐝');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold animate-pulse-glow">
              🐝
            </div>
            <span className="text-3xl font-bold h1bee-text-gradient">
              H1bee
            </span>
          </div>
          <p className="text-gray-600 text-sm">
            Where cultures connect & hearts meet 💛
          </p>
        </div>

        <Tabs value={isSignUp ? 'signup' : 'signin'} onValueChange={(value) => setIsSignUp(value === 'signup')}>
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-white border border-yellow-200">
            <TabsTrigger value="signup" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-orange-500 data-[state=active]:text-white">
              Join H1bee
            </TabsTrigger>
            <TabsTrigger value="signin" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-orange-500 data-[state=active]:text-white">
              Welcome Back
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signup">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
                  Start Your Journey
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Join H1bee and discover amazing people from different cultures! 🌍
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a secure password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                      required
                    />
                  </div>

                  <div className="space-y-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <Label className="text-gray-700 font-medium flex items-center">
                      <Users className="h-4 w-4 mr-2 text-yellow-600" />
                      I am:
                    </Label>
                    <RadioGroup
                      value={formData.userType}
                      onValueChange={(value) => handleInputChange('userType', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="american" id="american" className="border-yellow-400 text-yellow-600" />
                        <Label htmlFor="american" className="text-gray-700">American 🇺🇸</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="non_american" id="non_american" className="border-yellow-400 text-yellow-600" />
                        <Label htmlFor="non_american" className="text-gray-700">International 🌍</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.userType === 'non_american' && (
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-blue-500" />
                        Nationality
                      </Label>
                      <Select onValueChange={(value) => handleInputChange('nationality', value)}>
                        <SelectTrigger className="border-gray-200 focus:border-yellow-400">
                          <SelectValue placeholder="Select your nationality" />
                        </SelectTrigger>
                        <SelectContent>
                          {nationalities.map((nationality) => (
                            <SelectItem key={nationality} value={nationality.toLowerCase()}>
                              {nationality}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Gender</Label>
                    <Select onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger className="border-gray-200 focus:border-yellow-400">
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Man</SelectItem>
                        <SelectItem value="female">Woman</SelectItem>
                        <SelectItem value="non_binary">Non-binary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Orientation</Label>
                    <Select onValueChange={(value) => handleInputChange('orientation', value)}>
                      <SelectTrigger className="border-gray-200 focus:border-yellow-400">
                        <SelectValue placeholder="Select your orientation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="straight">Straight</SelectItem>
                        <SelectItem value="gay">Gay</SelectItem>
                        <SelectItem value="lesbian">Lesbian</SelectItem>
                        <SelectItem value="bisexual">Bisexual</SelectItem>
                        <SelectItem value="pansexual">Pansexual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-pink-500" />
                      Looking for
                    </Label>
                    <Select onValueChange={(value) => handleInputChange('relationshipGoal', value)}>
                      <SelectTrigger className="border-gray-200 focus:border-yellow-400">
                        <SelectValue placeholder="What are you looking for?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relationship">Long-term Relationship 💕</SelectItem>
                        <SelectItem value="cultural_exchange">Cultural Friends & Learning 🌍</SelectItem>
                        <SelectItem value="both">Both - I'm Open! ✨</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode" className="text-gray-700 font-medium">Zip Code</Label>
                    <Input
                      id="zipCode"
                      placeholder="Your zip code"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Join the H1bee Community! 🐝
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signin">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back! 🐝</CardTitle>
                <CardDescription className="text-gray-600">
                  Ready to continue your cultural journey? 💛
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-gray-700 font-medium">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-gray-700 font-medium">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Welcome Back to H1bee! 💛
                  </Button>

                  <div className="text-center">
                    <Button variant="link" className="text-sm text-gray-600 hover:text-yellow-600">
                      Forgot your password? 🤔
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            By joining H1bee, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}