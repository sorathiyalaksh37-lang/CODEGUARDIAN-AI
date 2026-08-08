import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { 
  ShieldCheckIcon, 
  BoltIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  CodeBracketIcon,
  SparklesIcon,
  RocketLaunchIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import ParticleBackground from '../components/ParticleBackground';
import GlowButton from '../components/GlowButton';
import AnimatedCard from '../components/AnimatedCard';
import AOS from 'aos';
import 'aos/dist/aos.css';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic'
    });
  }, []);

  const features = [
    {
      icon: <ShieldCheckIcon className="w-12 h-12" />,
      title: "AI-Powered Security",
      description: "Advanced machine learning algorithms detect vulnerabilities in real-time with 99% accuracy.",
      color: "from-green-500 to-emerald-600",
      delay: 0.1
    },
    {
      icon: <BoltIcon className="w-12 h-12" />,
      title: "Lightning Fast Scans",
      description: "Analyze 500+ files in seconds. Get instant security reports and actionable insights.",
      color: "from-yellow-500 to-orange-600",
      delay: 0.2
    },
    {
      icon: <UserGroupIcon className="w-12 h-12" />,
      title: "Team Collaboration",
      description: "Built-in team management, real-time chat, and collaborative security reviews.",
      color: "from-blue-500 to-cyan-600",
      delay: 0.3
    },
    {
      icon: <ChartBarIcon className="w-12 h-12" />,
      title: "Advanced Analytics",
      description: "Beautiful dashboards with interactive charts, trend analysis, and security metrics.",
      color: "from-purple-500 to-pink-600",
      delay: 0.4
    },
    {
      icon: <CodeBracketIcon className="w-12 h-12" />,
      title: "Intelligent Code Fixes",
      description: "AI suggests and applies fixes automatically. Learn secure coding as you work.",
      color: "from-indigo-500 to-purple-600",
      delay: 0.5
    },
    {
      icon: <SparklesIcon className="w-12 h-12" />,
      title: "AI Assistant",
      description: "Chat with our security AI. Get instant answers to your security questions.",
      color: "from-pink-500 to-rose-600",
      delay: 0.6
    }
  ];

  const stats = [
    { label: "Vulnerabilities Detected", value: "10K+", icon: ShieldCheckIcon },
    { label: "Repositories Scanned", value: "5K+", icon: CodeBracketIcon },
    { label: "Active Users", value: "2K+", icon: UserGroupIcon },
    { label: "Security Score Avg", value: "94%", icon: ChartBarIcon }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Security Engineer @ TechCorp",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      quote: "CodeGuardian AI saved us countless hours in security reviews. The AI-powered insights are incredibly accurate!"
    },
    {
      name: "Marcus Johnson",
      role: "Lead Developer @ StartupXYZ",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
      quote: "Best security tool we've used. The team collaboration features are game-changing for our workflow."
    },
    {
      name: "Elena Rodriguez",
      role: "CTO @ SecureApps",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
      quote: "The automated fix suggestions have improved our code quality significantly. Highly recommended!"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <ParticleBackground density={60} />
      
      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <ShieldCheckIcon className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                CodeGuardian AI
              </span>
            </motion.div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="hover:text-green-400 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-green-400 transition-colors">How It Works</a>
              <a href="#testimonials" className="hover:text-green-400 transition-colors">Testimonials</a>
            </div>

            <div className="flex items-center gap-4">
              <GlowButton 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/login')}
              >
                Login
              </GlowButton>
              <GlowButton 
                variant="primary" 
                size="sm"
                onClick={() => navigate('/register')}
                icon={<RocketLaunchIcon className="w-4 h-4" />}
              >
                Get Started
              </GlowButton>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full text-sm">
                <SparklesIcon className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-semibold">AI-Powered Security Platform</span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight"
            >
              <span className="bg-gradient-to-r from-white via-green-200 to-white bg-clip-text text-transparent">
                Secure Your Code
              </span>
              <br />
              <TypeAnimation
                sequence={[
                  'with AI Intelligence',
                  2000,
                  'in Real-Time',
                  2000,
                  'Automatically',
                  2000,
                  'with Confidence',
                  2000,
                ]}
                wrapper="span"
                speed={50}
                className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
                repeat={Infinity}
              />
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto"
            >
              Detect vulnerabilities, fix security issues, and collaborate with your team using cutting-edge AI technology.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <GlowButton 
                variant="primary" 
                size="lg"
                onClick={() => navigate('/register')}
                icon={<RocketLaunchIcon className="w-6 h-6" />}
              >
                Start Free Scan
              </GlowButton>
              <GlowButton 
                variant="outline" 
                size="lg"
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </GlowButton>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16"
            >
              {stats.map((stat, index) => (
                <AnimatedCard key={index} delay={0.8 + index * 0.1} gradient>
                  <stat.icon className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-zinc-400">{stat.label}</div>
                </AnimatedCard>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-zinc-500"
          >
            <span className="text-sm">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-zinc-500 rounded-full flex items-start justify-center p-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-zinc-500 rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20" data-aos="fade-up">
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Everything you need to secure your codebase, all in one platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} data-aos="fade-up" data-aos-delay={feature.delay * 100}>
                <AnimatedCard gradient hover className="h-full">
                  <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${feature.color} mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
                </AnimatedCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 px-6 relative bg-gradient-to-b from-transparent via-green-500/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20" data-aos="fade-up">
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Get started in minutes with our simple 3-step process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Connect Repository", desc: "Link your GitHub repository with one click", icon: LockClosedIcon },
              { step: "02", title: "AI Analysis", desc: "Our AI scans and analyzes your entire codebase", icon: SparklesIcon },
              { step: "03", title: "Get Results", desc: "Receive detailed reports with actionable fixes", icon: ChartBarIcon }
            ].map((item, index) => (
              <div key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="relative">
                  <AnimatedCard gradient hover>
                    <div className="text-6xl font-black text-green-500/20 mb-4">{item.step}</div>
                    <item.icon className="w-12 h-12 text-green-400 mb-4" />
                    <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                    <p className="text-zinc-400">{item.desc}</p>
                  </AnimatedCard>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-green-500 to-transparent" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20" data-aos="fade-up">
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Trusted by Developers
              </span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              See what security professionals are saying about CodeGuardian AI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <AnimatedCard gradient hover className="h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full border-2 border-green-500"
                    />
                    <div>
                      <div className="font-bold text-lg">{testimonial.name}</div>
                      <div className="text-sm text-zinc-400">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-zinc-300 italic leading-relaxed">"{testimonial.quote}"</p>
                </AnimatedCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-4xl mx-auto text-center" data-aos="fade-up">
          <AnimatedCard gradient className="p-12">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Ready to Secure Your Code?
            </h2>
            <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
              Join thousands of developers using AI to build more secure applications
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <GlowButton 
                variant="primary" 
                size="lg"
                onClick={() => navigate('/register')}
                icon={<RocketLaunchIcon className="w-6 h-6" />}
              >
                Start Free Trial
              </GlowButton>
              <GlowButton 
                variant="ghost" 
                size="lg"
                onClick={() => navigate('/login')}
              >
                Sign In
              </GlowButton>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <ShieldCheckIcon className="w-8 h-8 text-green-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                CodeGuardian AI
              </span>
            </div>
            <div className="text-zinc-400 text-sm">
              © 2024 CodeGuardian AI. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-zinc-400">
              <a href="#" className="hover:text-green-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-green-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-green-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
