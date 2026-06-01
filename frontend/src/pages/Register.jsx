import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaShieldAlt } from "react-icons/fa";
import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
        <h1 className="text-5xl font-black text-center">Create Account</h1>
        <p className="text-zinc-400 text-center mt-4">
          Join CodeGuardian AI for secure code reviews
        </p>

        {/* Form */}
        <form onSubmit={handleRegister} className="mt-10">
          <div className="mb-5">
            <label className="text-zinc-400">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full mt-3 bg-zinc-900/80 border border-zinc-700 rounded-2xl px-5 py-4 outline-none focus:border-green-500 transition-all"
            />
          </div>

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
              placeholder="Enter your password (min 6 characters)"
              className="w-full mt-3 bg-zinc-900/80 border border-zinc-700 rounded-2xl px-5 py-4 outline-none focus:border-green-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-black font-black py-4 rounded-2xl transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-zinc-400 mt-10">
          Already have an account?
          <Link to="/login" className="text-green-400 ml-2 font-bold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;