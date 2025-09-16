import { useState, useEffect, useContext } from "react";
import DataContext from "../../context/dataContext";
import axios from "axios";
import AppointmentScheduler from "./AppointmentScheduler";
import { toast } from "react-hot-toast";
import { apiUrl } from "../../api"; // ✅ use the helper

function UserAppointment() {
  const { user } = useContext(DataContext);
  const [selectAppointment, setSelectAppointment] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [displayOverlay, setDisplayOverlay] = useState(false);

  const getAppointment = async () => {
    if (!user?._id) return; // guard until user is ready
    try {
      const res = await axios.post(
        apiUrl("/appointments/docter"),
        { docter_id: user._id }
      );
      setAppointments(res?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load appointments");
    }
  };

  const deleteAppointment = async (id) => {
    try {
      await axios.delete(apiUrl(`/appointment/${id}`));
      toast.success("Appointment deleted successfully!");
      getAppointment();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting appointment");
    }
  };

  useEffect(() => {
    getAppointment();
  }, [user?._id]); // rerun when the logged-in user becomes available

  return (
    <div className="relative">
      {displayOverlay && (
        <AppointmentScheduler
          appointment={selectAppointment}
          getAppointment={getAppointment}
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
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => {
                    setSelectAppointment(a);
                    setDisplayOverlay(true);
                  }}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => deleteAppointment(a?._id)}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
          {appointments.length === 0 && (
            <tr>
              <td className="p-4 text-center text-gray-500" colSpan={5}>
                {user?._id ? "No appointments yet." : "Loading user…"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserAppointment;
