import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Tab from "./Tab";
import GeneralUserSignupForm from "./GeneralUserSignupForm";
import DoctorAppointment from "../DoctorPortal/DoctorAppointment";
import DoctorSignupForm from "./DoctorSignupForm";
function SignupForm() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState("HEALTHSEAKER");
  const [loading, setLoading] = useState(false);
  const tabData = [
    {
      id: 1,
      tabName: "Health_Seaker",
      type: "HEALTHSEAKER",
    },
    {
      id: 2,
      tabName: "Doctor",
      type: "DOCTOR",
    },
  ];



  return (
    <div
      className="relative p-8 rounded-2xl shadow-2xl backdrop-blur-md border border-white/20"
      style={{
        background: "var(--glass-bg)",
        boxShadow: "var(--glass-shadow)"
      }}
    >
      {loading && (<Loader></Loader>)}
      <Tab tabData={tabData} accountType={accountType} setAccountType={setAccountType} />
      {accountType == "HEALTHSEAKER" && (<GeneralUserSignupForm></GeneralUserSignupForm>)}
      {accountType == "DOCTOR" && (<DoctorSignupForm></DoctorSignupForm>)}
    </div>
  );
}

export default SignupForm;
