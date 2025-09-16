import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { apiUrl } from "../../api";// src/api.js

function GeneralUserSignupForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const { firstName, lastName, email, password, confirmPassword } = formData;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Build payload: trim where safe, exclude confirmPassword
    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password, // do not trim passwords
      accountType: "HEALTHSEAKER", // <- keep consistent with backend route logic
    };

    try {
      setLoading(true);
      const { data } = await axios.post(apiUrl("/user/register"), payload, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Account created successfully!");
      console.log("Signup response:", data);

      // Optional: clear form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      // Optional: redirect to login page
      // navigate("/login");
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "An error occurred. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Signup as Health Seeker</h2>
      <form onSubmit={handleOnSubmit} className="space-y-4">
        <div className="flex space-x-4">
          <input
            required
            type="text"
            name="firstName"
            value={firstName}
            onChange={handleOnChange}
            placeholder="First Name"
            className="bg-[#b2dded] text-black text-lg rounded-[0.5rem] w-full p-[12px] border-2 border-[#999999]"
          />
          <input
            required
            type="text"
            name="lastName"
            value={lastName}
            onChange={handleOnChange}
            placeholder="Last Name"
            className="bg-[#b2dded] text-black text-lg rounded-[0.5rem] w-full p-[12px] border-2 border-[#999999]"
          />
        </div>

        <input
          required
          type="email"
          name="email"
          value={email}
          onChange={handleOnChange}
          placeholder="Email Address"
          className="bg-[#b2dded] text-black text-lg rounded-[0.5rem] w-full p-[12px] border-2 border-[#999999]"
        />

        <div className="flex space-x-4">
          <input
            required
            type="password"
            name="password"
            value={password}
            onChange={handleOnChange}
            placeholder="Password"
            className="bg-[#b2dded] text-black text-lg rounded-[0.5rem] w-full p-[12px] border-2 border-[#999999]"
          />
          <input
            required
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleOnChange}
            placeholder="Confirm Password"
            className="bg-[#b2dded] text-black text-lg rounded-[0.5rem] w-full p-[12px] border-2 border-[#999999]"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Signup"}
        </button>
      </form>
    </div>
  );
}

export default GeneralUserSignupForm;
