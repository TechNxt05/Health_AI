import React from "react";
import "./IndividualDoctorProfile.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { apiUrl } from "../../api"; // ← adjust if needed

const IndividualDoctorProfile = ({ profile, user, setLoading }) => {
  const navigate = useNavigate();

  const limitDescription = (description) => {
    if (!description) return "";
    const words = description.split(" ");
    return words.length > 10 ? `${words.slice(0, 10).join(" ")}...` : description;
  };

  async function bookAppointment() {
    if (!user?._id) return toast.error("Please log in to book an appointment.");
    if (!profile?._id) return toast.error("Doctor profile not loaded yet.");

    try {
      setLoading?.(true);
      const payload = {
        user_id: user._id,
        docter_id: profile._id, // backend expects 'docter_id'
        user_name: user.firstName,
        user_email: user.email,
        doctor_name: profile.name,
        doctor_email: profile.email,
      };
      await axios.post(apiUrl("/appointment"), payload);
      toast.success("Appointment created! Check status on Dashboard.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create appointment. Please try again.");
    } finally {
      setLoading?.(false);
    }
  }

  const fee =
    typeof profile?.consultation_fee === "number"
      ? profile.consultation_fee
      : null;

  return (
    <div className="individual-doctor-profile relative">
      <div className="upper">
        <div className="imageContainer">
          <img
            src={profile?.image_url || "/placeholder-doctor.png"}
            alt={profile?.name || "Doctor"}
          />
        </div>
        <div>
          <div className="name">{profile?.name || "Doctor"}</div>
          <div className="field">{profile?.field || "Specialist"}</div>
          {fee !== null && (
            <div className="fee">Consultation Fee: ${fee}</div>
          )}
          {(profile?.mobile || profile?.email) && (
            <div className="mobema">
              {profile?.mobile && <div>Mobile: {profile.mobile}</div>}
              {profile?.email && <div>Email: {profile.email}</div>}
            </div>
          )}
        </div>
      </div>

      <div className="lower">
        <div className="talknow">
          <div className="desc">{limitDescription(profile?.description)}</div>

          <div className="flex gap-2 w-full p-2">
            <button
              className="w-1/2 text-[12px] bg-[#05c37d] hover:bg-[#04a16c] text-white py-2 rounded"
              onClick={bookAppointment}
            >
              Book Appointment {fee !== null ? `- $${fee}/hour` : ""}
            </button>

            <button
              className="w-1/2 text-[12px] hover:bg-[#04a16c] py-2 rounded border border-[#04a16c] text-[#04a16c]"
              onClick={() => navigate("/doctor-chat", { state: { profile } })}
            >
              Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualDoctorProfile;
