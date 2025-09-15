import React, { useEffect, useState } from 'react';
import './DoctorProfilePage.css';
import IndividualDoctorProfile from './IndividualDoctorProfile';
import { useCookies } from 'react-cookie';
import { apiUrl } from "./api"; // fix path as needed

const DoctorsProfilePage = () => {
  const [cookies] = useCookies(['medgenai']);
  const role = cookies?.medgenai?.accountType || '';
  const [displayObject, setDisplayObject] = useState([]);

  useEffect(() => {
    const fetchDoctorProfiles = async () => {
      try {
        const response = await fetch(apiUrl("/docters"));
        if (!response.ok) {
          throw new Error('Failed to fetch doctor profiles');
        }
        const data = await response.json();
        console.log('Fetched profiles:', data);
        setDisplayObject(data);
      } catch (error) {
        console.error('Error fetching doctor profiles:', error);
      }
    };

    const fetchHealthSeakerProfile = async () => {
      try {
        const response = await fetch(apiUrl("/users"));
        if (!response.ok) {
          throw new Error('Failed to fetch doctor profiles');
        }
        const data = await response.json();
        console.log('Fetched profiles:', data);
        setDisplayObject(data);
      } catch (error) {
        console.error('Error fetching doctor profiles:', error);
      }
    };

    if (role === 'HEALTHSEAKER') {
      fetchDoctorProfiles();
    } else {
      fetchHealthSeakerProfile();
    }
  }, [role, cookies]);

  console.log('Display object:', displayObject);

  return (
    <div className="doctor-profile-page">
      <div className="container">
        <h4>Connect With Our Doctors</h4>
        <div className="containerofIndividualDoctorProfile">
          {displayObject.map((profile, index) => (
            <IndividualDoctorProfile key={index} profile={profile} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorsProfilePage;
