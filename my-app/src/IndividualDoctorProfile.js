import React from "react";
import "./IndividualDoctorProfile.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { apiUrl } from "./api"; // adjust path if this file isn't next to api.js

const IndividualDoctorProfile = ({ profile, user, setLoading }) => {
  const navigate = useNavigate();

  const limitDescription = (description) => {
    if (!description) return "";
    const words = description.split(" ");
    return words.length > 10 ? `${words.slice(0, 10).join(" ")}...` : description;
  };

  async function bookAppointment() {
    // basic guards so we don't fire a broken request
    if (!user?._id) {
      toast.error("Please log in to book an appointment.");
      return;
    }
    if (!profile?._id) {
      toast.error("Doctor profile not loaded yet.");
      return;
    }

    try {
      setLoading?.(true);
      const payload = {
        user_id: user._id,
        docter_id: profile._id,          // keeping your backend’s key naming
        user_name: user.firstName,
        user_email: user.email,
        doctor_name: profile.name,
        doctor_email: profile.email,
      };

      const res = await axios.post(apiUrl("/appointment"), payload);
      // optional: check res.status or res.data for success
      toast.success("Appointment created! Check status on Dashboard.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create appointment. Please try again.");
    } finally {
      setLoading?.(false);
    }
  }

  return (
    <div className="individual-doctor-profile relative">
      <div className="upper">
        <div className="imageContainer">
          <img src={profile?.image_url} alt={profile?.name} />
        </div>
        <div>
          <div className="name">{profile?.name}</div>
          <div className="field">{profile?.field}</div>

          {profile?.consultation_fee != null && (
            <div className="fee">Consultation Fee: ${profile.consultation_fee}</div>
          )}

          {profile?.mobile && (
            <div className="mobema">
              <div>Mobile: {profile.mobile}</div>
              <div>Email: {profile?.email}</div>
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
              Book Appointment {profile?.consultation_fee != null && (
                <span>${profile.consultation_fee}/hour</span>
              )}
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
