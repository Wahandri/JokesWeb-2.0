import React, { useState, useEffect } from 'react';
import './MyAlert.css';
const MyAlert = ({ text }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {isVisible && (
        <>
          <div className="blur-background"></div> {/* Fondo borroso */}
          <div className="my-alert-container"> {/* Alert */}
            <p>{text}</p>
          </div>
        </>
      )}
    </>
  );
};

export default MyAlert;
