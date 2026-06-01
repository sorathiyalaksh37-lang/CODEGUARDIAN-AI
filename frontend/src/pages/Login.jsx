import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaGithub, FaShieldAlt } from "react-icons/fa";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
      console.log("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-5 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-green-500/20 blur-3xl rounded-full" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-blue-500/20 blur-3xl rounded-full" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-green-500 flex items-center justify-center">
            <FaShieldAlt className="text-4xl text-black" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-black text-center">Welcome Back</h1>
        <p className="text-zinc-400 text-center mt-4">
          Login to continue using CodeGuardian AI
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="mt-10">
          <div className="mb-5">
            <label className="text-zinc-400">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full mt-3 bg-zinc-900/80 border border-zinc-700 rounded-2xl px-5 py-4 outline-none focus:border-green-500 transition-all"
            />
          </div>

          <div className="mb-6">
            <label className="text-zinc-400">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full mt-3 bg-zinc-900/80 border border-zinc-700 rounded-2xl px-5 py-4 outline-none focus:border-green-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-black font-black py-4 rounded-2xl transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-[1px] bg-zinc-700" />
          <p className="text-zinc-500">OR</p>
          <div className="flex-1 h-[1px] bg-zinc-700" />
        </div>

        {/* GitHub Login */}
        <a
          href="http://localhost:8000/api/auth/github"
          className="w-full flex items-center justify-center gap-4 bg-white hover:bg-zinc-200 text-black py-4 rounded-2xl font-bold transition-all"
        >
          <FaGithub className="text-2xl" />
          Continue with GitHub
        </a>

        {/* Register Link */}
        <p className="text-center text-zinc-400 mt-10">
          Don't have an account?
          <Link to="/register" className="text-green-400 ml-2 font-bold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;