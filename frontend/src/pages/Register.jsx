import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { 
  ShieldCheckIcon, 
  UserIcon,
  EnvelopeIcon, 
  LockClosedIcon,
  ArrowRightIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";
import api from "../services/api";
import ParticleBackground from "../components/ParticleBackground";
import GlowButton from "../components/GlowButton";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Password strength validator
  const getPasswordStrength = () => {
    if (password.length === 0) return null;
    if (password.length < 6) return { label: 'Too Short', color: 'red', width: 25 };
    if (password.length < 8) return { label: 'Weak', color: 'orange', width: 50 };
    if (password.length < 12) return { label: 'Good', color: 'yellow', width: 75 };
    return { label: 'Strong', color: 'green', width: 100 };
  };

  const passwordStrength = getPasswordStrength();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      if (data.success && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Registration Successful!");
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      console.log("Register error:", error);
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <ParticleBackground density={50} />

      {/* Animated Background Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[-200px] right-[-200px] w-[500px] h-[500px] bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl rounded-full"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[-200px] left-[-200px] w-[500px] h-[500px] bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-3xl rounded-full"
      />

      {/* Register Card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md"
      >
        <motion.div 
          variants={itemVariants}
          className="bg-zinc-900/50 backdrop-blur-2xl border border-zinc-800 rounded-3xl p-8 md:p-10 shadow-2xl"
        >
          {/* Logo */}
          <motion.div 
            variants={itemVariants}
            className="flex justify-center mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/50"
            >
              <ShieldCheckIcon className="w-10 h-10 text-white" />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-black mb-3">
              <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Create Account
              </span>
            </h1>
            <p className="text-zinc-400">
              Join CodeGuardian AI for secure code reviews
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Name Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <motion.input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your full name"
                  whileFocus={{ scale: 1.01 }}
                  className={`w-full bg-black/50 border ${
                    focusedField === 'name' ? 'border-green-500 ring-2 ring-green-500/20' : 'border-zinc-700'
                  } rounded-xl pl-12 pr-4 py-4 outline-none transition-all duration-300`}
                />
                <AnimatePresence>
                  {name.length > 2 && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <motion.input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your email"
                  whileFocus={{ scale: 1.01 }}
                  className={`w-full bg-black/50 border ${
                    focusedField === 'email' ? 'border-green-500 ring-2 ring-green-500/20' : 'border-zinc-700'
                  } rounded-xl pl-12 pr-4 py-4 outline-none transition-all duration-300`}
                />
                <AnimatePresence>
                  {email.includes('@') && email.includes('.') && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <motion.input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Create a strong password"
                  whileFocus={{ scale: 1.01 }}
                  className={`w-full bg-black/50 border ${
                    focusedField === 'password' ? 'border-green-500 ring-2 ring-green-500/20' : 'border-zinc-700'
                  } rounded-xl pl-12 pr-12 py-4 outline-none transition-all duration-300`}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
              
              {/* Password Strength Indicator */}
              <AnimatePresence>
                {passwordStrength && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-zinc-400">Password Strength</span>
                      <span className={`text-xs font-semibold text-${passwordStrength.color}-400`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${passwordStrength.width}%` }}
                        className={`h-full bg-gradient-to-r ${
                          passwordStrength.color === 'red' ? 'from-red-500 to-red-600' :
                          passwordStrength.color === 'orange' ? 'from-orange-500 to-orange-600' :
                          passwordStrength.color === 'yellow' ? 'from-yellow-500 to-yellow-600' :
                          'from-green-500 to-green-600'
                        }`}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Register Button */}
            <motion.div variants={itemVariants}>
              <GlowButton
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading}
                icon={<ArrowRightIcon />}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </GlowButton>
            </motion.div>
          </form>

          {/* Terms */}
          <motion.p 
            variants={itemVariants}
            className="text-center text-xs text-zinc-500 mt-6"
          >
            By registering, you agree to our{" "}
            <a href="#" className="text-green-400 hover:text-green-300">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-green-400 hover:text-green-300">Privacy Policy</a>
          </motion.p>

          {/* Login Link */}
          <motion.p 
            variants={itemVariants}
            className="text-center text-zinc-400 mt-6"
          >
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="text-green-400 font-bold hover:text-green-300 transition-colors"
            >
              Login
            </Link>
          </motion.p>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6"
        >
          <Link 
            to="/" 
            className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors inline-flex items-center gap-2"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
