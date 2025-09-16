import { useState, useEffect, useContext } from "react";
import DataContext from "../../context/dataContext";
import axios from "axios";
import AppointmentScheduler from "./AppointmentScheduler";
import { toast } from "react-hot-toast";
import { apiUrl } from "../../api";

function UserAppointment() {
  const { user } = useContext(DataContext);
  const [selectAppointment, setSelectAppointment] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [displayOverlay, setDisplayOverlay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const auth = {}; // e.g. { headers: { Authorization: `Bearer ${token}` } }

  const getAppointment = async (signal) => {
    if (!user?._id) return;
    try {
      setLoading(true);
      setErr("");
      const res = await axios.post(
        apiUrl("/appointments/docter"),
        { docter_id: user._id },
        { signal, ...auth }
      );
      setAppointments(res?.data || []);
    } catch (e) {
      if (axios.isCancel?.(e) || e?.name === "CanceledError") return;
      console.error(e);
      setErr("Failed to load appointments");
      toast.error("Failed to load appointments");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteAppointment = async (id) => {
    try {
      await axios.delete(apiUrl(`/appointment/${id}`), auth);
      toast.success("Appointment deleted successfully!");
      await getAppointment();
    } catch (e) {
      console.error(e);
      toast.error("Error deleting appointment");
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    getAppointment(controller.signal);
    return () => controller.abort();
  }, [user?._id]); // refetch when user changes

  const isActionDisabled = (a) => Boolean(a?.status && a.status !== "PENDING");

  return (
    <div className="relative">
      {displayOverlay && (
        <AppointmentScheduler
          appointment={selectAppointment}
          getAppointment={() => getAppointment()}
          setDisplayOverlay={setDisplayOverlay}
        />
      )}

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
          {appointments.map((a) => (
            <tr key={a._id}>
              <td className="border border-gray-300 p-2 text-black">{a.user_name}</td>
              <td className="border border-gray-300 p-2 text-black">{a.user_email}</td>
              <td className="border border-gray-300 p-2 text-black">{a.date}</td>
              <td className="border border-gray-300 p-2 text-black">{a.time}</td>
              <td className="border border-gray-300 p-2 text-black">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2 disabled:opacity-50"
                  onClick={() => { setSelectAppointment(a); setDisplayOverlay(true); }}
                  disabled={isActionDisabled(a)}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded disabled:opacity-50"
                  onClick={() => deleteAppointment(a?._id)}
                  disabled={isActionDisabled(a)}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}

          {(loading || err || appointments.length === 0) && (
            <tr>
              <td className="p-4 text-center text-gray-500" colSpan={5}>
                {loading
                  ? "Loading…"
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
