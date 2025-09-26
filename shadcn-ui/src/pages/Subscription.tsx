import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Check, CreditCard, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Subscription() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    billingAddress: ''
  });

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly Premium',
      price: 40,
      period: 'month',
      description: 'Perfect for getting started',
      features: [
        'Unlimited matches',
        'AI conversation starters',
        'Cultural events access',
        'Premium messaging',
        'Profile verification',
        'Advanced filters'
      ]
    },
    {
      id: 'yearly',
      name: 'Yearly Premium',
      price: 400,
      period: 'year',
      savings: 'Save $80',
      description: 'Best value for serious connections',
      features: [
        'All monthly features',
        'Priority matching algorithm',
        'Exclusive VIP events',
        'Immigration resources',
        'Cultural newsletter',
        'Dedicated support',
        'Profile boost (monthly)',
        'Read receipts'
      ]
    }
  ];

  const selectedPlanData = plans.find(plan => plan.id === selectedPlan);

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.nameOnCard) {
      toast.error('Please fill in all payment details');
      return;
    }

    // Simulate payment processing
    toast.success('Processing payment...');
    
    setTimeout(() => {
      // Store subscription data
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const subscriptionData = {
        plan: selectedPlan,
        price: selectedPlanData?.price,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + (selectedPlan === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      };
      
      const updatedUser = { 
        ...currentUser, 
        subscription: subscriptionData,
        isPremium: true
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      toast.success('Payment successful! Welcome to CulturalConnect Premium!');
      navigate('/dashboard');
    }, 2000);
  };

  const skipPayment = () => {
    // Allow users to skip payment for demo purposes
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const updatedUser = { ...currentUser, isPremium: false };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    toast.info('Continuing with free trial');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CulturalConnect
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Premium Plan</h1>
          <p className="text-gray-600">Unlock the full potential of cross-cultural connections</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Plan Selection */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {plans.map((plan) => (
                <Card 
                  key={plan.id}
                  className={`cursor-pointer transition-all ${
                    selectedPlan === plan.id 
                      ? 'border-blue-500 shadow-lg ring-2 ring-blue-200' 
                      : 'border-gray-200 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                      </div>
                      {plan.savings && (
                        <Badge className="bg-green-100 text-green-800">
                          {plan.savings}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-600 ml-1">/{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Security Notice */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-blue-900">Secure Payment</h3>
                    <p className="text-sm text-blue-700">
                      Your payment information is encrypted and secure. We use industry-standard SSL encryption.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Details
                </CardTitle>
                <CardDescription>
                  Complete your subscription to {selectedPlanData?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nameOnCard">Name on Card</Label>
                    <Input
                      id="nameOnCard"
                      value={paymentData.nameOnCard}
                      onChange={(e) => handleInputChange('nameOnCard', e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        value={paymentData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        value={paymentData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="billingAddress">Billing Address</Label>
                    <Input
                      id="billingAddress"
                      value={paymentData.billingAddress}
                      onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                      placeholder="123 Main St, City, State 12345"
                    />
                  </div>

                  {/* Order Summary */}
                  <div className="border-t pt-4 mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">{selectedPlanData?.name}</span>
                      <span className="font-semibold">${selectedPlanData?.price}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total</span>
                      <span>${selectedPlanData?.price}</span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 mt-6">
                    <Zap className="h-4 w-4 mr-2" />
                    Subscribe Now
                  </Button>

                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={skipPayment}
                  >
                    Continue with Free Trial
                  </Button>
                </form>

                <div className="mt-4 text-xs text-gray-500 text-center">
                  By subscribing, you agree to our Terms of Service and Privacy Policy.
                  You can cancel anytime from your account settings.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}