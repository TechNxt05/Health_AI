import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import 'reactjs-popup/dist/index.css';
import PopUp from '../PopUp';
import DataContext from '../context/dataContext';
import ProfileOverlay from './Auth/ProfileOverlay';
function ResponsiveAppBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [popUpData, setPopUpData] = useState(null); // Store dynamic data for the pop-up
  const { user } = useContext(DataContext);
  const analyseImage = {
    headText: 'Image Analysis',
    button1Text: 'Image Diagnosis',
    button1Route: '/uploadImage',
    button2Text: 'Medical Report',
    button2Route: '/handle-uploader',
  };

  const dataset = {
    headText: 'Dataset Generation',
    button1Text: 'From Sample',
    button1Route: '/generateDataFromSample',
    button2Text: 'From Field',
    button2Route: '/generateData',
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleMenuClick = (data) => {
    setPopUpData(data);
    setShowPopUp(true);
  };

  return (
    <div className={`navbar ${isScrolled ? 'scrolled' : ''}`} style={{
      background: isScrolled ? 'var(--glass-bg)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(12px)' : 'none',
      borderBottom: isScrolled ? '1px solid var(--glass-border)' : 'none',
      transition: 'all 0.3s ease-in-out'
    }}>
      <div className="logo" style={{ color: 'var(--text-primary)', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>HEALTHAI</div>
      <div className="links">
        <ul className="ulLinks">
          <li className="linkItem">
            <a href="/" style={{ color: 'var(--text-primary)' }}>Home</a>
          </li>
          <li className="linkItem">
            <a href="/chatbot" style={{ color: 'var(--text-primary)' }}>Chat Bot</a>
          </li>
          <li className="linkItem">
            <a href="/diagonsis" style={{ color: 'var(--text-primary)' }}>Disease Diagnosis</a>
          </li>
          <li className="linkItem" onClick={() => handleMenuClick(analyseImage)} style={{ color: 'var(--text-primary)' }}>
            Image Analysis
          </li>
          <li className="linkItem" onClick={() => handleMenuClick(dataset)} style={{ color: 'var(--text-primary)' }}>
            Dataset Generation
          </li>
          {showPopUp && <PopUp onClose={() => setShowPopUp(false)} data={popUpData} />}{' '}
          {/* Pass popUpData to PopUp */}
          <li className="linkItem">
            <a href="/doctors-profile" style={{ color: 'var(--text-primary)' }}>Connect with Doctor</a>
          </li>
          <li className="linkItem">
            <a href="/druggeneration" style={{ color: 'var(--text-primary)' }}>Drug Generation From Smiles</a>
          </li>
          <li className="linkItem">
            <a href="/druggenerationfromdisease" style={{ color: 'var(--text-primary)' }}>Drug Generation From Disease</a>
          </li>
        </ul>
      </div>
      {user ? (<ProfileOverlay></ProfileOverlay>) : (<div className='flex gap-4 justify-center'>
        <a href="/login" className='text-sm font-semibold rounded-full bg-white text-indigo-600 hover:bg-slate-100 py-2 px-6 transition-all shadow-md hover:shadow-lg'>Login</a>
        <a href="/signup" className='text-sm font-semibold rounded-full bg-indigo-600 text-white hover:bg-indigo-700 py-2 px-6 transition-all shadow-md hover:shadow-lg border border-indigo-500'>SignUp</a>
      </div>)}

    </div>
  );
}

export default ResponsiveAppBar;
