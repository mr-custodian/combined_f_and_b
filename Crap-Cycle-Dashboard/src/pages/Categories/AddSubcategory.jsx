// AddSubcategory.js
import React, { useState } from 'react';
import axios from 'axios';

export default function AddSubcategory({ parentId, onSubcategoryAdded }) {
    const [subcategoryName, setSubcategoryName] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL+'/api/subcategory/add', {
                subcategoryName,
                parentId
            });
            console.log(response.data);
            onSubcategoryAdded();
            setSubcategoryName("");
        } catch (error) {
            console.error("There was an error adding the subcategory!", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
            <input
                type="text"
                name="subcategoryName"
                value={subcategoryName}
                onChange={(e) => setSubcategoryName(e.target.value)}
                placeholder="Subcategory Name"
                className="placeholder:text-center mb-4 p-3 w-3/4 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-3xl hover:bg-green-700 transition duration-300"
            >
                Add Subcategory
            </button>
        </form>
    );
}
