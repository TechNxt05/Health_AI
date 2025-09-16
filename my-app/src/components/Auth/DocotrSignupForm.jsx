import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { apiUrl } from "../api"; // ensure src/api.js

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
      const { data } = await axios.post(apiUrl("/docter/register"), payload, {
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
      <h2 className="text-2xl font-bold mb-4">Signup as Doctor</h2>

      <form onSubmit={handleOnSubmit} className="space-y-4">
        <input
          required
          type="text"
          name="name"
          value={formData.name}
          onChange={handleOnChange}
          placeholder="Name"
          className="bg-[#b2dded] text-black text-lg rounded-[0.5rem] w-full p-[12px] border-2 border-[#999999]"
        />

        <input
          required
          type="email"
          name="email"
          value={formData.email}
          onChange={handleOnChange}
          placeholder="Email Address"
          className="bg-[#b2dded] text-black text-lg rounded-[0.5rem] w-full p-[12px] border-2 border-[#999999]"
        />

        <input
          required
          type="password"
          name="password"
          value={formData.password}
          onChange={handleOnChange}
          placeholder="Password"
          className="bg-[#b2dded] text-black text-lg rounded-[0.5rem] w-full p-[12px] border-2 border-[#999999]"
        />

        <select
          required
          name="field"
          value={formData.field}
          onChange={handleOnChange}
          className="bg-[#b2dded] text-black text-lg rounded-[0.5rem] w-full p-[12px] border-2 border-[#999999]"
        >
          <option value="" disabled>
            Select Specialization
          </option>
          {specializations.map((spec) => (
            <option key={spec} value={spec}>
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
          className="bg-[#b2dded] text-black text-lg rounded-[0.5rem] w-full p-[12px] border-2 border-[#999999]"
        />

        <input
          required
          type="text"
          name="address"
          value={formData.address}
          onChange={handleOnChange}
          placeholder="Address"
          className="bg-[#b2dded] text-black text-lg rounded-[0.5rem] w-full p-[12px] border-2 border-[#999999]"
        />

        <input
          required
          type="tel"
          name="mobile"
          value={formData.mobile}
          onChange={handleOnChange}
          placeholder="Mobile Number"
          className="bg-[#b2dded] text-black text-lg rounded-[0.5rem] w-full p-[12px] border-2 border-[#999999]"
        />

        <textarea
          required
          name="description"
          value={formData.description}
          onChange={handleOnChange}
          placeholder="Description"
          className="bg-[#b2dded] text-black text-lg rounded-[0.5rem] w-full p-[12px] border-2 border-[#999999]"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-60"
        >
          {loading ? "Creating Account..." : "Signup"}
        </button>
      </form>
    </div>
  );
}

export default DoctorSignupForm;
