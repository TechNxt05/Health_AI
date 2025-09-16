import { useState, useEffect, useContext } from "react";
import DataContext from "../../context/dataContext";
import axios from "axios";
import { apiUrl } from "../../api";

function UserAppointment() {
  const { user } = useContext(DataContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const getAppointment = async (signal) => {
    if (!user?._id) return;
    try {
      setLoading(true);
      setErr("");
      const res = await axios.post(
        apiUrl("/appointments/user"),
        { user_id: user._id },
        { signal } // axios supports AbortSignal in recent versions
      );
      setAppointments(res?.data || []);
    } catch (e) {
      if (axios.isCancel?.(e) || e?.name === "CanceledError") return;
      console.error(e);
      setErr("Failed to load appointments.");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    getAppointment(controller.signal);
    return () => controller.abort();
    // re-run if user changes
  }, [user?._id]);

  const canJoin = (appt) => Boolean(appt?.date); // adapt if you add status/meeting link

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Appointments</h2>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-white text-black">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Date</th>
            <th className="p-2">Time</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment._id}>
              <td className="border border-gray-300 p-2 text-black">
                {appointment.doctor_name}
              </td>
              <td className="border border-gray-300 p-2 text-black">
                {appointment.doctor_email}
              </td>
              <td className="border border-gray-300 p-2 text-black">
                {appointment.date}
              </td>
              <td className="border border-gray-300 p-2 text-black">
                {appointment.time}
              </td>
              <td className="border border-gray-300 p-2 text-black">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2 disabled:opacity-50"
                  disabled={!canJoin(appointment)}
                  onClick={() => {
                    // TODO: navigate to meeting link when you add it
                  }}
                >
                  Join
                </button>
              </td>
            </tr>
          ))}

          {(loading || err || appointments.length === 0) && (
            <tr>
              <td colSpan={5} className="text-center text-gray-500 p-4">
                {loading
                  ? "Loading appointments…"
                  : err
                  ? err
                  : user?._id
                  ? "No appointments yet."
                  : "Loading user…"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserAppointment;
