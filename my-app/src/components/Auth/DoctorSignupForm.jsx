import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { apiUrl } from "../../api"; // ensure src/api.js

function DoctorSignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    field: "",
    consultation_fee: "",
    address: "",
    mobile: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const specializations = [
    "Cardiologist",
    "Dermatologist",
    "Pediatrician",
    "Orthopedic",
    "Neurologist",
    "Psychiatrist",
    "Gynecologist",
    "General Physician",
    "ENT Specialist",
    "Radiologist",
  ];

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // basic sanitize & type-fix
    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password, // do not trim passwords
      field: formData.field,       // matches backend field key
      consultation_fee:
        formData.consultation_fee === ""
          ? undefined
          : Number(formData.consultation_fee),
      address: formData.address.trim(),
      mobile: formData.mobile.trim(),
      description: formData.description.trim(),
      accountType: "DOCTOR",
    };

    if (Number.isNaN(payload.consultation_fee)) {
      toast.error("Consultation fee must be a number.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(apiUrl("/doctor/register"), payload, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Account created successfully!");
      // optional: clear form or redirect
      setFormData({
        name: "",
        email: "",
        password: "",
        field: "",
        consultation_fee: "",
        address: "",
        mobile: "",
        description: "",
      });
      // e.g., navigate("/login");
      console.log("Signup response:", data);
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
      <h2 className="text-2xl font-bold mb-4 text-slate-200">Signup as Doctor</h2>

      <form onSubmit={handleOnSubmit} className="space-y-4">
        <input
          required
          type="text"
          name="name"
          value={formData.name}
          onChange={handleOnChange}
          placeholder="Name"
          className="auth-input text-white placeholder:text-slate-400"
        />

        <input
          required
          type="email"
          name="email"
          value={formData.email}
          onChange={handleOnChange}
          placeholder="Email Address"
          className="auth-input text-white placeholder:text-slate-400"
        />

        <input
          required
          type="password"
          name="password"
          value={formData.password}
          onChange={handleOnChange}
          placeholder="Password"
          className="auth-input text-white placeholder:text-slate-400"
        />

        <select
          required
          name="field"
          value={formData.field}
          onChange={handleOnChange}
          className="auth-input text-white bg-slate-800"
        >
          <option value="" disabled className="text-slate-400">
            Select Specialization
          </option>
          {specializations.map((spec) => (
            <option key={spec} value={spec} className="bg-slate-800 text-white">
              {spec}
            </option>
          ))}
        </select>

        <input
          required
          type="number"
          min="0"
          step="1"
          name="consultation_fee"
          value={formData.consultation_fee}
          onChange={handleOnChange}
          placeholder="Appointment Price"
          className="auth-input text-white placeholder:text-slate-400"
        />

        <input
          required
          type="text"
          name="address"
          value={formData.address}
          onChange={handleOnChange}
          placeholder="Address"
          className="auth-input text-white placeholder:text-slate-400"
        />

        <input
          required
          type="tel"
          name="mobile"
          value={formData.mobile}
          onChange={handleOnChange}
          placeholder="Mobile Number"
          className="auth-input text-white placeholder:text-slate-400"
        />

        <textarea
          required
          name="description"
          value={formData.description}
          onChange={handleOnChange}
          placeholder="Description"
          className="auth-input text-white placeholder:text-slate-400"
          rows="3"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-600 text-white p-2 rounded hover:bg-cyan-500 disabled:opacity-60 transition-colors font-semibold"
        >
          {loading ? "Creating Account..." : "Signup"}
        </button>
      </form>
    </div>
  );
}

export default DoctorSignupForm;
