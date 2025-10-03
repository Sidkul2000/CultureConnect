import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Globe, MessageSquare, Calendar, Shield, Zap, Check, Star, Users, Sparkles, MapPin, Coffee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useEffect } from "react";

export default function Landing() {
  const navigate = useNavigate();
  const features = [
    {
      icon: <Users className="h-8 w-8 text-yellow-500" />,
      title: "Meet People",
      description: "Connect with amazing individuals from different cultures and backgrounds for meaningful relationships",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      icon: <Coffee className="h-8 w-8 text-pink-500" />,
      title: "Join Groups",
      description: "Find your tribe in cultural interest groups, hobby circles, and local community gatherings",
      gradient: "from-pink-400 to-rose-500"
    },
    {
      icon: <Calendar className="h-8 w-8 text-purple-500" />,
      title: "Attend Events",
      description: "Experience festivals, food tours, language exchanges, and cultural celebrations together",
      gradient: "from-purple-400 to-indigo-500"
    },
    {
      icon: <Globe className="h-8 w-8 text-blue-500" />,
      title: "Cultural Exchange",
      description: "Share your heritage while learning about others in a warm, welcoming environment",
      gradient: "from-blue-400 to-cyan-500"
    }
  ];

  const pricingPlans = [
    {
      name: "Monthly Bee",
      price: "$29",
      period: "/month",
      popular: false,
      emoji: "🐝",
      features: [
        "Unlimited connections & matches",
        "Join cultural groups & events",
        "AI conversation helpers",
        "Photo & video sharing",
        "Cultural compatibility insights",
        "Event planning tools",
        "Community support",
        "Mobile app access"
      ]
    },
    {
      name: "Yearly Hive",
      price: "$290",
      period: "/year",
      savings: "Save $58 per year",
      popular: true,
      emoji: "🏠",
      features: [
        "Everything in Monthly Bee",
        "Priority event access",
        "Exclusive cultural experiences",
        "Personal culture coach",
        "Advanced matching algorithm",
        "Video chat & calls",
        "Travel buddy connections",
        "VIP community access",
        "Cultural newsletter & guides"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50">
      {/* Navigation */}
      <nav className="glass-morphism sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold animate-pulse-glow">
                  🐝
                </div>
              </div>
              <span className="text-3xl font-bold h1bee-text-gradient">
                H1bee
              </span>
              <Badge className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1">
                Beta
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/auth')}
                className="text-gray-600 hover:text-yellow-600 hover:bg-yellow-50"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Join H1bee
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/20 via-pink-200/20 to-purple-200/20 animate-gradient"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="flex justify-center mb-6">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 text-sm font-medium">
              🌍 Where Cultures Connect & Hearts Meet
            </Badge>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
            <div className="flex-1 flex flex-col items-center md:items-center">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight text-center md:text-center">
                Find Your
                <span className="h1bee-text-gradient animate-gradient block">
                  Cultural Match
                </span>
              </h1>
              <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed text-center md:text-center">
                H1bee brings together people from different cultures for meaningful connections, friendships, and love.
                <br />
                <span className="font-semibold text-yellow-600">Meet People | Join Groups | Plan Events</span>
              </p>
            </div>
            <div className="flex-1 flex justify-center items-center relative">
             <div className="w-full max-w-xs h-[500px] relative overflow-hidden rounded-2xl shadow-2xl border-4 border-white/60">
               <img
                 id="hero-image"
                 src="https://plus.unsplash.com/premium_photo-1731355246208-4eb2b30cbd93?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                 alt="Cultural Match"
                 className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                 style={{
                   boxShadow: "0 8px 32px 0 rgba(255, 193, 7, 0.15), 0 1.5px 8px 0 rgba(233, 30, 99, 0.10)",
                   background: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,193,7,0.12) 100%)"
                 }}
               />
               <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
                 background: "radial-gradient(circle at 60% 40%, rgba(255,193,7,0.18) 0%, rgba(233,30,99,0.10) 70%, transparent 100%)"
               }}></div>
             </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Start Connecting Today
              <Heart className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-yellow-400 text-yellow-600 hover:bg-yellow-50 px-8 py-4 text-lg font-semibold"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See How It Works
            </Button>
          </div>
          
          {/* Floating Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
            <div className="text-center animate-float">
              <div className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-2">15,000+</div>
              <div className="text-gray-600 font-medium">Cultural Connections</div>
            </div>
            <div className="text-center animate-float" style={{ animationDelay: '0.5s' }}>
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent mb-2">80+</div>
              <div className="text-gray-600 font-medium">Countries United</div>
            </div>
            <div className="text-center animate-float" style={{ animationDelay: '1s' }}>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent mb-2">500+</div>
              <div className="text-gray-600 font-medium">Events Monthly</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Your Cultural Journey Starts Here
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              More than just dating - H1bee is your gateway to meaningful friendships, cultural adventures, and lasting love connections.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className={`text-center border-0 shadow-lg hover:shadow-2xl card-hover bg-gradient-to-br ${feature.gradient} p-1`}>
                <div className="bg-white rounded-lg p-6 h-full">
                  <CardHeader className="pb-4">
                    <div className="mx-auto mb-4 p-4 bg-gray-50 rounded-full w-fit">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl mb-2 font-bold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-yellow-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How H1bee Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your journey to meaningful cross-cultural connections in three simple steps.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                emoji: "👋",
                title: "Create Your Vibe",
                description: "Share your cultural story, interests, and what kind of connections you're looking for. Be authentic - that's what makes H1bee special!"
              },
              {
                step: "2", 
                emoji: "🎯",
                title: "Discover Your People",
                description: "Our smart matching connects you with like-minded people based on cultural interests, values, and relationship goals."
              },
              {
                step: "3",
                emoji: "🎉",
                title: "Connect & Celebrate",
                description: "Start conversations, join groups, attend events, and build meaningful relationships that celebrate cultural diversity."
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-lg">
                    {item.step}
                  </div>
                  <div className="absolute -top-2 -right-2 text-3xl animate-bounce">
                    {item.emoji}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800 text-sm px-3 py-1">
              💝 Simple & Fair Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Join the H1bee Community
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your cultural journey. All plans include our core features for meaningful connections.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative overflow-hidden card-hover ${
                plan.popular 
                  ? 'border-2 border-yellow-400 shadow-2xl scale-105 bg-gradient-to-br from-yellow-50 to-orange-50' 
                  : 'border border-gray-200 shadow-lg bg-white'
              }`}>
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-center py-3 text-sm font-bold">
                    <Star className="inline h-4 w-4 mr-1" />
                    MOST POPULAR CHOICE
                  </div>
                )}
                
                <CardHeader className={`text-center ${plan.popular ? 'pt-16' : 'pt-8'}`}>
                  <div className="text-4xl mb-2">{plan.emoji}</div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center mt-6">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2 text-lg">{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <Badge className="mt-3 bg-green-100 text-green-800 font-semibold">
                      {plan.savings}
                    </Badge>
                  )}
                </CardHeader>
                
                <CardContent className="px-8 pb-8">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full py-4 text-lg font-bold transition-all duration-300 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-lg hover:shadow-xl' 
                        : 'bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600'
                    }`}
                    onClick={() => navigate('/auth')}
                  >
                    Choose {plan.name} {plan.emoji}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4 text-lg">
              All plans include a 7-day free trial. Cancel anytime, no questions asked! 💛
            </p>
            <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-1" />
                Secure Payment
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 mr-1" />
                No Hidden Fees
              </div>
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                Love Guarantee
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="text-6xl mb-6">🌍💕</div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Find Your Cultural Match?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of members who have found meaningful relationships, friendships, and cultural connections through H1bee.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Start Your Cultural Journey
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-lg font-bold"
              onClick={() => navigate('/auth')}
            >
              Try Free for 7 Days
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-lg">
                  🐝
                </div>
                <span className="text-2xl font-bold">H1bee</span>
              </div>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Building bridges between cultures, one meaningful connection at a time. 🌍💛
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-lg">Connect</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-yellow-400 transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Success Stories</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Cultural Events</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Community Groups</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-lg">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Safety Guide</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Cultural Tips</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-lg">Legal</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Community Guidelines</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 H1bee. All rights reserved. Connecting hearts across cultures with love. 🐝💕</p>
          </div>
        </div>
      </footer>
    </div>
  );
}




