import { useState, useEffect, useContext } from "react";
import DataContext from "../../context/dataContext";
import axios from "axios";
import { apiUrl } from "../../api"; // ✅ use helper

function UserAppointment() {
  const [appointments, setAppointments] = useState([]);
  const { user } = useContext(DataContext);

  const getAppointment = async () => {
    if (!user?._id) return; // wait for user
    try {
      const res = await axios.post(apiUrl("/appointments/user"), {
        user_id: user._id,
      });
      setAppointments(res?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAppointment();
  }, [user?._id]);

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
              {appointment?.date && (
                <td className="border border-gray-300 p-2 text-black">
                  <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
                    Join
                  </button>
                </td>
              )}
            </tr>
          ))}

          {appointments.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center text-gray-500 p-4">
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
