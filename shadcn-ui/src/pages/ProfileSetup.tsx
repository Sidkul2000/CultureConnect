import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    culturalJourney: '',
    height: '',
    education: '',
    occupation: '',
    languages: [] as string[],
    interests: [] as string[],
    photos: [] as string[],
    preferences: {
      interestedInEvents: true,
      interestedInImmigrationNews: false,
      interestedInCulturalTrivia: true,
      minAge: 25,
      maxAge: 45,
      maxDistance: 50
    }
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const languageOptions = [
    'English', 'Spanish', 'Portuguese', 'French', 'German', 'Italian', 'Mandarin',
    'Japanese', 'Korean', 'Hindi', 'Arabic', 'Russian', 'Dutch', 'Swedish', 'Other'
  ];

  const interestOptions = [
    'Travel', 'Cooking', 'Music', 'Dancing', 'Art', 'Photography', 'Reading',
    'Sports', 'Fitness', 'Movies', 'Technology', 'Fashion', 'Food', 'Culture',
    'Languages', 'History', 'Nature', 'Adventure', 'Meditation', 'Volunteering'
  ];

  const handleInputChange = (field: string, value: string | number | boolean | string[]) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (array: string[], item: string, field: string) => {
    const newArray = array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
    handleInputChange(field, newArray);
  };

  const handlePhotoUpload = () => {
    // Simulate photo upload
    const newPhoto = `https://images.unsplash.com/photo-${Date.now()}?w=400&h=400&fit=crop&crop=face`;
    setProfileData(prev => ({
      ...prev,
      photos: [...prev.photos, newPhoto]
    }));
    toast.success('Photo uploaded successfully!');
  };

  const removePhoto = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Validation
    if (!profileData.firstName || !profileData.lastName || !profileData.culturalJourney) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (profileData.photos.length === 0) {
      toast.error('Please upload at least one photo');
      return;
    }

    // Save profile data
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const updatedUser = { ...currentUser, profile: profileData, profileCompleted: true };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    toast.success('Profile setup completed!');
    navigate('/subscription');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Your first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Your last name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell others about yourself..."
                className="h-24"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={profileData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  placeholder="170"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Input
                  id="education"
                  value={profileData.education}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  placeholder="Your education level"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                value={profileData.occupation}
                onChange={(e) => handleInputChange('occupation', e.target.value)}
                placeholder="What do you do for work?"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-lg font-semibold">Cultural Journey *</Label>
              <p className="text-sm text-gray-600">
                "My Interests and Journey Across Cultural Boundaries" - Express why you're open to cross-cultural dating and what you hope to learn or share.
              </p>
              <Textarea
                value={profileData.culturalJourney}
                onChange={(e) => handleInputChange('culturalJourney', e.target.value)}
                placeholder="Share your story about cultural curiosity, experiences with different cultures, what attracts you to cross-cultural relationships, and what you hope to discover or contribute..."
                className="h-32"
              />
            </div>

            <div className="space-y-3">
              <Label>Languages I Speak</Label>
              <div className="flex flex-wrap gap-2">
                {languageOptions.map((language) => (
                  <Badge
                    key={language}
                    variant={profileData.languages.includes(language) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleArrayToggle(profileData.languages, language, 'languages')}
                  >
                    {language}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>My Interests</Label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((interest) => (
                  <Badge
                    key={interest}
                    variant={profileData.interests.includes(interest) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleArrayToggle(profileData.interests, interest, 'interests')}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-lg font-semibold">Profile Photos</Label>
              <p className="text-sm text-gray-600">
                Add photos that represent you well. Your first photo will be your main profile picture.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {profileData.photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo}
                      alt={`Profile ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2 h-6 w-6 p-0"
                      onClick={() => removePhoto(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    {index === 0 && (
                      <Badge className="absolute bottom-2 left-2 text-xs">
                        Main Photo
                      </Badge>
                    )}
                  </div>
                ))}
                
                {profileData.photos.length < 6 && (
                  <Button
                    variant="outline"
                    className="h-32 border-dashed"
                    onClick={handlePhotoUpload}
                  >
                    <div className="text-center">
                      <Upload className="h-6 w-6 mx-auto mb-2" />
                      <span className="text-sm">Add Photo</span>
                    </div>
                  </Button>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Preferences & Interests</Label>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="events"
                    checked={profileData.preferences.interestedInEvents}
                    onCheckedChange={(checked) => 
                      handleInputChange('preferences', {
                        ...profileData.preferences,
                        interestedInEvents: !!checked
                      })
                    }
                  />
                  <Label htmlFor="events">Interested in local cultural events?</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="immigration"
                    checked={profileData.preferences.interestedInImmigrationNews}
                    onCheckedChange={(checked) => 
                      handleInputChange('preferences', {
                        ...profileData.preferences,
                        interestedInImmigrationNews: !!checked
                      })
                    }
                  />
                  <Label htmlFor="immigration">Interested in immigration-related news and assistance?</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="trivia"
                    checked={profileData.preferences.interestedInCulturalTrivia}
                    onCheckedChange={(checked) => 
                      handleInputChange('preferences', {
                        ...profileData.preferences,
                        interestedInCulturalTrivia: !!checked
                      })
                    }
                  />
                  <Label htmlFor="trivia">Interested in trivia/fun facts about global cultures?</Label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Age Range</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={profileData.preferences.minAge}
                      onChange={(e) => 
                        handleInputChange('preferences', {
                          ...profileData.preferences,
                          minAge: parseInt(e.target.value)
                        })
                      }
                      min="18"
                      max="100"
                    />
                    <span>to</span>
                    <Input
                      type="number"
                      value={profileData.preferences.maxAge}
                      onChange={(e) => 
                        handleInputChange('preferences', {
                          ...profileData.preferences,
                          maxAge: parseInt(e.target.value)
                        })
                      }
                      min="18"
                      max="100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Max Distance (miles)</Label>
                  <Input
                    type="number"
                    value={profileData.preferences.maxDistance}
                    onChange={(e) => 
                      handleInputChange('preferences', {
                        ...profileData.preferences,
                        maxDistance: parseInt(e.target.value)
                      })
                    }
                    min="1"
                    max="500"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CulturalConnect
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Step {currentStep} of {totalSteps}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Basic Information"}
              {currentStep === 2 && "Cultural Journey & Interests"}
              {currentStep === 3 && "Profile Photos"}
              {currentStep === 4 && "Preferences"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us about yourself"}
              {currentStep === 2 && "Share your cultural story and interests"}
              {currentStep === 3 && "Add photos to showcase your personality"}
              {currentStep === 4 && "Set your matching preferences"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < totalSteps ? (
                <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                  Next
                </Button>
              ) : (
                <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
                  Complete Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}