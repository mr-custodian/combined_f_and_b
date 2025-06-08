import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ConfirmationModal = ({ show, onClose, onConfirm }) => {
  const [transitionId, setTransitionId] = useState('');

  const handleInputChange = (event) => {
    setTransitionId(event.target.value);
  };

  const handleConfirm = () => {
    if (!transitionId) {
      // Show an error message if transitionId is null or empty
      window.alert('Transition ID is required!');
      return;
    }

    onConfirm(transitionId);
    onClose();
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h3 className="text-lg font-semibold mb-4">Enter Transition ID</h3>
        <input
          type="text"
          value={transitionId}
          onChange={handleInputChange}
          className="border-2 border-gray-300 rounded-full px-4 py-2 w-full mb-4"
          placeholder="Enter Transition ID"
          required
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="border-2 border-red-600 bg-red-600 text-white hover:bg-white hover:text-red-600 px-4 py-2 rounded-full"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="border-2 border-green-600 bg-green-600 text-white hover:bg-white hover:text-green-600 px-4 py-2 rounded-full"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
