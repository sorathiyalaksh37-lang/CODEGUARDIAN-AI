import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { 
  ShieldCheckIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  ArrowRightIcon,
  EyeIcon,
  EyeSlashIcon
} from "@heroicons/react/24/outline";
import { FaGithub } from "react-icons/fa";
import api from "../services/api";
import ParticleBackground from "../components/ParticleBackground";
import GlowButton from "../components/GlowButton";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      if (data.success && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Login Successful!");
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      const message = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
      
      if (error.response?.status === 400) {
        toast.error("Invalid credentials. Please check your email and password.");
      }
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
        className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-gradient-to-r from-green-500/20 to-emerald-500/20 blur-3xl rounded-full"
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
        className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-full"
      />

      {/* Login Card */}
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
              whileHover={{ scale: 1.1, rotate: 5 }}
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
                Welcome Back
              </span>
            </h1>
            <p className="text-zinc-400">
              Login to continue using CodeGuardian AI
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
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
                  {focusedField === 'email' && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -right-2 top-1/2 -translate-y-1/2"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
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
                  placeholder="Enter your password"
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
                <AnimatePresence>
                  {focusedField === 'password' && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -right-2 top-1/2 -translate-y-1/2"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Login Button */}
            <motion.div variants={itemVariants}>
              <GlowButton
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading}
                icon={<ArrowRightIcon />}
              >
                {loading ? "Logging In..." : "Login"}
              </GlowButton>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
            <span className="text-zinc-500 text-sm">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
          </motion.div>

          {/* GitHub Login */}
          <motion.div variants={itemVariants}>
            <motion.a
              href="http://localhost:8000/api/auth/github"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-3 w-full bg-white hover:bg-zinc-100 text-black py-4 rounded-xl font-bold transition-all"
            >
              <FaGithub className="text-2xl" />
              Continue with GitHub
            </motion.a>
          </motion.div>

          {/* Register Link */}
          <motion.p 
            variants={itemVariants}
            className="text-center text-zinc-400 mt-8"
          >
            Don't have an account?{" "}
            <Link 
              to="/register" 
              className="text-green-400 font-bold hover:text-green-300 transition-colors"
            >
              Register
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

export default Login;
