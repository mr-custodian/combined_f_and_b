import React, { useState, useEffect } from "react";
import { MdWifiOff } from "react-icons/md";

const NetworkStatus = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        if (response.ok) {
          setIsOnline(true);
          setShowPopup(false);
        } else {
          setIsOnline(false);
          setShowPopup(true);
        }
      } catch (error) {
        setIsOnline(false);
        setShowPopup(true);
      }
    };

    const handleOnline = () => {
      setIsOnline(true);
      setShowPopup(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowPopup(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Perform an actual request to check online status
    checkConnection();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div>
      {children}
      {!isOnline && showPopup && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center space-x-2">
          <MdWifiOff className="text-white text-2xl" />
          <div>
            <p className="font-bold">No Network Connection</p>
            <p className="text-sm">Please check your connection.</p>
          </div>
          <button
            className="bg-white text-green-500 px-2 py-1 rounded hover:bg-gray-200"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
};

export default NetworkStatus;
