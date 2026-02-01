import { useState, useContext } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import DataContext from "../../context/dataContext";
import Loader from "../Loader";
import Tab from "./Tab";
import { toast } from "react-hot-toast";
import { apiUrl } from "../../api"; // ✅ lives in src/api.js

function LoginForm() {
  const { user, setUser } = useContext(DataContext);
  const [accountType, setAccountType] = useState("HEALTHSEAKER"); // keeps your backend route logic
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const tabData = [
    { id: 1, tabName: "Health_Seaker", type: "HEALTHSEAKER" },
    { id: 2, tabName: "Doctor", type: "DOCTOR" },
  ];

  const handleSetCookie = (data) => {
    Cookies.set("medgenai", JSON.stringify(data), {
      expires: 7,
      secure: true,     // fine on Vercel (HTTPS)
      sameSite: "lax",
    });
    navigate("/");
  };

  function handleOnChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleOnSubmit(e) {
    e.preventDefault();
    const targetroute = accountType === "HEALTHSEAKER" ? "user" : "doctor";
    try {
      setLoading(true);
      const res = await axios.post(
        apiUrl(`/${targetroute}/signin`),
        { email, password }
      );
      const data = res?.data;
      if (!data) throw new Error("Empty response");
      setUser(data);
      handleSetCookie(data);
      toast.success("Signed in successfully");
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Sign in failed. Check your credentials."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="relative p-8 rounded-2xl shadow-2xl backdrop-blur-md border border-white/20"
      style={{
        background: "var(--glass-bg)",
        boxShadow: "var(--glass-shadow)"
      }}
    >
      {loading && <Loader />}

      <Tab tabData={tabData} accountType={accountType} setAccountType={setAccountType} />

      <form onSubmit={handleOnSubmit} className="flex flex-col w-full gap-y-4 mt-6">
        <label className="w-full">
          <p className="text-[0.875rem] text-slate-200 font-bold mb-1 leading-[1.375rem]">
            Email Address <sup className="text-pink-500">*</sup>
          </p>
          <input
            required
            type="email"
            value={email}
            onChange={handleOnChange}
            placeholder="Enter email address"
            name="email"
            className="bg-slate-800/50 text-white text-lg rounded-xl w-full p-3 border border-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200/50 outline-none transition-all placeholder:text-slate-400"
          />
        </label>

        <label className="relative">
          <p className="text-[0.875rem] text-slate-200 font-bold mb-1 leading-[1.375rem]">
            Password <sup className="text-pink-500">*</sup>
          </p>
          <input
            required
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handleOnChange}
            placeholder="Enter Password"
            name="password"
            className="bg-slate-800/50 text-white text-lg rounded-xl w-full p-3 border border-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200/50 outline-none transition-all placeholder:text-slate-400"
          />
          <span
            className="absolute right-3 top-[38px] cursor-pointer text-slate-500 hover:text-indigo-600 transition-colors"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <AiOutlineEyeInvisible fontSize={24} />
            ) : (
              <AiOutlineEye fontSize={24} />
            )}
          </span>

          <Link to="/forgot-password">
            <p className="text-xs mt-1 text-indigo-600 font-bold max-w-max ml-auto hover:text-indigo-800">
              Forgot Password
            </p>
          </Link>
        </label>

        <div className="flex gap-3 justify-center mt-2">
          <button type="button" onClick={() => { setAccountType("HEALTHSEAKER"); setFormData({ email: "demo@patient.com", password: "password123" }); }} className="text-xs bg-blue-50 p-2 rounded-lg text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors">
            Demo Patient
          </button>
          <button type="button" onClick={() => { setAccountType("DOCTOR"); setFormData({ email: "demo@doctor.com", password: "password123" }); }} className="text-xs bg-green-50 p-2 rounded-lg text-green-700 hover:bg-green-100 border border-green-200 transition-colors">
            Demo Doctor
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn w-full mt-6 flex justify-center items-center py-3"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
