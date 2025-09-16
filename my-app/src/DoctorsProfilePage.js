import React, { useEffect, useMemo, useState } from "react";
import "./DoctorProfilePage.css";
import IndividualDoctorProfile from "./IndividualDoctorProfile";
import { useCookies } from "react-cookie";
import { apiUrl } from "../../api"; // <-- likely correct path

const DoctorsProfilePage = () => {
  const [cookies] = useCookies(["medgenai"]);
  const [displayObject, setDisplayObject] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Parse the cookie safely
  const cookieData = useMemo(() => {
    try {
      return cookies?.medgenai ? JSON.parse(cookies.medgenai) : null;
    } catch {
      return null;
    }
  }, [cookies]);

  // Make sure this matches what you actually store: "HEALTHSEAKER" vs "HEALTHSEEKER"
  const role = cookieData?.accountType ?? "";

  useEffect(() => {
    const fetchDoctorProfiles = async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(apiUrl("/docters"));
        if (!res.ok) throw new Error("Failed to fetch doctor profiles");
        const data = await res.json();
        setDisplayObject(Array.isArray(data) ? data : []);
      } catch (e) {
        setErr(e.message || "Error fetching doctor profiles");
        setDisplayObject([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchHealthSeekerProfiles = async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(apiUrl("/users"));
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setDisplayObject(Array.isArray(data) ? data : []);
      } catch (e) {
        setErr(e.message || "Error fetching users");
        setDisplayObject([]);
      } finally {
        setLoading(false);
      }
    };

    if (!role) {
      // no cookie yet — you can choose to default to doctors or do nothing
      fetchDoctorProfiles();
      return;
    }

    if (role === "HEALTHSEAKER") {
      // or "HEALTHSEEKER" depending on your real value
      fetchDoctorProfiles();
    } else {
      fetchHealthSeekerProfiles();
    }
  }, [role]);

  return (
    <div className="doctor-profile-page">
      <div className="container">
        <h4>Connect With Our Doctors</h4>

        {loading && <div className="text-gray-500 mt-4">Loading…</div>}
        {err && (
          <div className="mt-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">
            {err}
          </div>
        )}
        {!loading && !err && displayObject.length === 0 && (
          <div className="text-gray-500 mt-4">No profiles found.</div>
        )}

        <div className="containerofIndividualDoctorProfile">
          {displayObject.map((profile) => (
            <IndividualDoctorProfile key={profile._id || profile.email} profile={profile} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorsProfilePage;
