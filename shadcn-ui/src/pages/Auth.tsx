import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, ArrowLeft, ArrowRight, Upload, MapPin, Sparkles, Camera, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  birthday: string;
  gender: string;
  orientation: string;
  userType: string;
  nationality: string;
  location: string;
  relationshipGoal: string;
  interests: string[];
  photos: string[];
  bio: string;
}

const SIGNUP_STEPS = [
  { id: 1, title: 'Welcome', subtitle: 'Let\'s get started!' },
  { id: 2, title: 'Basic Info', subtitle: 'Tell us about yourself' },
  { id: 3, title: 'Identity', subtitle: 'Help us understand you' },
  { id: 4, title: 'Location', subtitle: 'Where are you?' },
  { id: 5, title: 'Photos', subtitle: 'Show your best self' },
  { id: 6, title: 'Interests', subtitle: 'What do you love?' },
  { id: 7, title: 'Bio', subtitle: 'Share your story' },
  { id: 8, title: 'Complete', subtitle: 'You\'re all set!' }
];

const INTERESTS = [
  'Travel', 'Food & Cooking', 'Music', 'Dancing', 'Art', 'Photography', 'Reading', 'Movies',
  'Fitness', 'Yoga', 'Hiking', 'Beach', 'Coffee', 'Wine', 'Languages', 'Culture',
  'Fashion', 'Technology', 'Gaming', 'Sports', 'Meditation', 'Volunteering', 'Pets', 'Nature'
];

const NATIONALITIES = [
  'Brazilian', 'Mexican', 'Indian', 'Chinese', 'German', 'French', 'Italian', 'Japanese',
  'Korean', 'Russian', 'Canadian', 'British', 'Australian', 'Spanish', 'Portuguese',
  'Dutch', 'Swedish', 'Norwegian', 'Polish', 'Turkish', 'Egyptian', 'Nigerian', 'Other'
];

export default function Auth() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [signUpData, setSignUpData] = useState<SignUpData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    birthday: '',
    gender: '',
    orientation: '',
    userType: '',
    nationality: '',
    location: '',
    relationshipGoal: '',
    interests: [],
    photos: [],
    bio: ''
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const updateSignUpData = (field: keyof SignUpData, value: string | string[]) => {
    setSignUpData(prev => ({ ...prev, [field]: value }));
  };

  const toggleInterest = (interest: string) => {
    setSignUpData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const nextStep = () => {
    if (currentStep < SIGNUP_STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return signUpData.email && signUpData.password && signUpData.confirmPassword;
      case 2:
        return signUpData.firstName && signUpData.lastName && signUpData.birthday;
      case 3:
        return signUpData.gender && signUpData.orientation && signUpData.userType;
      case 4:
        return signUpData.location && (signUpData.userType === 'american' || signUpData.nationality);
      case 5:
        return signUpData.photos.length > 0;
      case 6:
        return signUpData.interests.length >= 3;
      case 7:
        return signUpData.bio.length >= 50;
      default:
        return true;
    }
  };

  const handleSignUp = () => {
    const userData = {
      ...signUpData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      profileCompleted: true
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userData));
    toast.success('Welcome to H1bee! 🐝✨', {
      description: "Your profile is ready! Let's find your cultural match!"
    });
    navigate('/dashboard');
  };

  const handleLogin = () => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.email === loginData.email && user.password === loginData.password) {
        toast.success('Welcome back to H1bee! 🐝💛');
        navigate('/dashboard');
      } else {
        toast.error('Hmm, those credentials don\'t look right 🤔');
      }
    } else {
      toast.error('No account found. Join the H1bee community first! 🐝');
    }
  };

  const addPhoto = () => {
    const photoUrl = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=400&h=600&fit=crop&crop=face`;
    setSignUpData(prev => ({
      ...prev,
      photos: [...prev.photos, photoUrl]
    }));
  };

  const removePhoto = (index: number) => {
    setSignUpData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  if (!isSignUp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
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
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold animate-pulse-glow">
                🐝
              </div>
              <span className="text-3xl font-bold h1bee-text-gradient">H1bee</span>
            </div>
          </div>

          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back! 🐝</CardTitle>
              <CardDescription className="text-gray-600">
                Ready to continue your cultural journey? 💛
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-gray-700 font-medium">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-gray-700 font-medium">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
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
              </form>

              <div className="text-center mt-6">
                <Button 
                  variant="link" 
                  onClick={() => setIsSignUp(true)}
                  className="text-yellow-600 hover:text-yellow-700"
                >
                  Don't have an account? Join H1bee! 🐝
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const progress = (currentStep / SIGNUP_STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          {currentStep > 1 && (
            <Button
              variant="ghost"
              onClick={prevStep}
              className="mb-4 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold animate-pulse-glow">
              🐝
            </div>
            <span className="text-2xl font-bold h1bee-text-gradient">H1bee</span>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Step {currentStep} of {SIGNUP_STEPS.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-200">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </Progress>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">{SIGNUP_STEPS[currentStep - 1].title}</h2>
            <p className="text-gray-600">{SIGNUP_STEPS[currentStep - 1].subtitle}</p>
          </div>
        </div>

        {/* Step Content */}
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm card-hover">
          <CardContent className="p-6">
            {/* Step 1: Welcome & Credentials */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">👋</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Let's create your H1bee profile!</h3>
                  <p className="text-gray-600">First, we need your email and password</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={signUpData.email}
                    onChange={(e) => updateSignUpData('email', e.target.value)}
                    className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a secure password"
                    value={signUpData.password}
                    onChange={(e) => updateSignUpData('password', e.target.value)}
                    className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={signUpData.confirmPassword}
                    onChange={(e) => updateSignUpData('confirmPassword', e.target.value)}
                    className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Basic Info */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">😊</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">What should we call you?</h3>
                  <p className="text-gray-600">Tell us your name and birthday</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="Your first name"
                      value={signUpData.firstName}
                      onChange={(e) => updateSignUpData('firstName', e.target.value)}
                      className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Your last name"
                      value={signUpData.lastName}
                      onChange={(e) => updateSignUpData('lastName', e.target.value)}
                      className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthday" className="text-gray-700 font-medium">Birthday</Label>
                  <Input
                    id="birthday"
                    type="date"
                    value={signUpData.birthday}
                    onChange={(e) => updateSignUpData('birthday', e.target.value)}
                    className="border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Identity */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">🌈</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Tell us about yourself</h3>
                  <p className="text-gray-600">Help us find your perfect matches</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-gray-700 font-medium">I identify as</Label>
                    <Select onValueChange={(value) => updateSignUpData('gender', value)}>
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

                  <div className="space-y-3">
                    <Label className="text-gray-700 font-medium">I'm interested in</Label>
                    <Select onValueChange={(value) => updateSignUpData('orientation', value)}>
                      <SelectTrigger className="border-gray-200 focus:border-yellow-400">
                        <SelectValue placeholder="Select your preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="men">Men</SelectItem>
                        <SelectItem value="women">Women</SelectItem>
                        <SelectItem value="everyone">Everyone</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <Label className="text-gray-700 font-medium">I am</Label>
                    <RadioGroup
                      value={signUpData.userType}
                      onValueChange={(value) => updateSignUpData('userType', value)}
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
                </div>
              </div>
            )}

            {/* Step 4: Location */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">📍</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Where are you located?</h3>
                  <p className="text-gray-600">This helps us find people nearby</p>
                </div>

                {signUpData.userType === 'non_american' && (
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Your nationality</Label>
                    <Select onValueChange={(value) => updateSignUpData('nationality', value)}>
                      <SelectTrigger className="border-gray-200 focus:border-yellow-400">
                        <SelectValue placeholder="Select your nationality" />
                      </SelectTrigger>
                      <SelectContent>
                        {NATIONALITIES.map((nationality) => (
                          <SelectItem key={nationality} value={nationality.toLowerCase()}>
                            {nationality}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-gray-700 font-medium">Current location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="location"
                      placeholder="City, State"
                      value={signUpData.location}
                      onChange={(e) => updateSignUpData('location', e.target.value)}
                      className="pl-10 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Looking for</Label>
                  <Select onValueChange={(value) => updateSignUpData('relationshipGoal', value)}>
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
              </div>
            )}

            {/* Step 5: Photos */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">📸</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Show your best self!</h3>
                  <p className="text-gray-600">Add at least one photo to get started</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {signUpData.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {signUpData.photos.length < 6 && (
                    <Button
                      variant="outline"
                      onClick={addPhoto}
                      className="h-32 border-2 border-dashed border-yellow-300 hover:border-yellow-400 hover:bg-yellow-50"
                    >
                      <div className="text-center">
                        <Camera className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                        <span className="text-sm text-gray-600">Add Photo</span>
                      </div>
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Step 6: Interests */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">❤️</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">What do you love?</h3>
                  <p className="text-gray-600">Pick at least 3 interests (you can change these later)</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((interest) => (
                    <Badge
                      key={interest}
                      variant={signUpData.interests.includes(interest) ? "default" : "outline"}
                      className={`cursor-pointer transition-all duration-200 ${
                        signUpData.interests.includes(interest)
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600'
                          : 'border-yellow-300 text-gray-700 hover:bg-yellow-50'
                      }`}
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                      {signUpData.interests.includes(interest) && (
                        <Check className="h-3 w-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>

                <div className="text-center text-sm text-gray-600">
                  Selected: {signUpData.interests.length} / {INTERESTS.length}
                </div>
              </div>
            )}

            {/* Step 7: Bio */}
            {currentStep === 7 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">✍️</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Tell your story</h3>
                  <p className="text-gray-600">Write a bio that shows your personality (min 50 characters)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-gray-700 font-medium">About you</Label>
                  <textarea
                    id="bio"
                    placeholder="Share something interesting about yourself, your cultural background, or what you're looking for..."
                    value={signUpData.bio}
                    onChange={(e) => updateSignUpData('bio', e.target.value)}
                    className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:border-yellow-400 focus:ring-yellow-400 resize-none"
                  />
                  <div className="text-right text-sm text-gray-500">
                    {signUpData.bio.length} / 50 minimum
                  </div>
                </div>
              </div>
            )}

            {/* Step 8: Complete */}
            {currentStep === 8 && (
              <div className="text-center space-y-6">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-gray-900">You're all set!</h3>
                <p className="text-gray-600 text-lg">
                  Welcome to H1bee! Your profile looks amazing and you're ready to start connecting with people from different cultures.
                </p>
                
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <h4 className="font-bold text-gray-900 mb-2">What's next?</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>🐝 Discover exceptional people from different cultures</li>
                    <li>💬 Start meaningful conversations</li>
                    <li>🎉 Join cultural events and meetups</li>
                    <li>🌍 Learn and share cultural experiences</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && currentStep < 8 && (
                <Button
                  variant="outline"
                  onClick={prevStep}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}

              {currentStep < 7 && (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className={`ml-auto bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold ${
                    !canProceed() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}

              {currentStep === 7 && (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className={`ml-auto bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold ${
                    !canProceed() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Complete Profile
                  <Sparkles className="h-4 w-4 ml-2" />
                </Button>
              )}

              {currentStep === 8 && (
                <Button
                  onClick={handleSignUp}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start My H1bee Journey! 🐝✨
                </Button>
              )}
            </div>

            {/* Login Link */}
            {currentStep === 1 && (
              <div className="text-center mt-6">
                <Button 
                  variant="link" 
                  onClick={() => setIsSignUp(false)}
                  className="text-yellow-600 hover:text-yellow-700"
                >
                  Already have an account? Sign in! 🐝
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}