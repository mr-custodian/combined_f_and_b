import React, { useState, useEffect } from 'react';
import Sidebar from '../../component/Sidebar';
import axios from 'axios';

export default function UpdateTnc() {
    const [tnc, setTnc] = useState(''); // State to hold the TnC text
    const [isEditing, setIsEditing] = useState(false); // State to toggle between view and edit mode

    useEffect(() => {
        // Fetch the existing TnC from the backend
        const fetchTnc = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_BACKEND_URL+'/api/other/tnc');
                setTnc(response.data.tnc); // Adjusted to access 'tnc' field from the response
            } catch (error) {
                console.error('Error fetching TnC:', error);
            }
        };

        fetchTnc();
    }, []);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            await axios.post(import.meta.env.VITE_BACKEND_URL+'/api/other/tnc', { tnc:tnc }); // Posting the updated TnC to the backend
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating TnC:', error);
        }
    };

    return (
        <Sidebar page="Update TNC">
            <div className="container mx-auto pt-10">
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {isEditing ? (
                        <textarea
                            className="w-full h-64 p-4 border border-gray-300 rounded-lg"
                            value={tnc}
                            onChange={(e) => setTnc(e.target.value)}
                        />
                    ) : (
                        <p className="whitespace-pre-wrap">{tnc}</p> // Displaying TnC text
                    )}

                    <div className="mt-4">
                        {isEditing ? (
                            <button
                                onClick={handleSaveClick}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition ease-in-out duration-300"
                            >
                                Save
                            </button>
                        ) : (
                            <button
                                onClick={handleEditClick}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition ease-in-out duration-300"
                            >
                                Edit
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}
