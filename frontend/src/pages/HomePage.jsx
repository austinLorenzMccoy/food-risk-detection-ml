/* eslint-disable */
import React from "react";
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ResultsPage from './ResultsPage';
import ErrorPage from './ErrorPage';


const PredictionForm= () => {
    useEffect (() => {
	/// Set default date to current day
	const today = new Date().toISOString().split('T')[0];
	const dateInput = document.getElementById("detection_date");
	if (dateInput) dateInput.value = today;
    }, []);
    const handleSubmit = (e) => {
	e.preventDefault();
	// form submission logic
	alert('Form Submitted Successfully');
    }
    
    return ( <div className="bg-gray-100 min-h-screen py-8">
	       <div className="container mx-auto px-4 max-w-2x1">
	         <div className="bg-white rounded-lg shadow-lg p-6">
	           <h1 className="text-2xl font-bold text-grey-800 mb-6">Food Adulterant Analysis</h1>
	           <form onSubmit={handleSubmit} className="space-y-6">
	     {[
		 {id: 'product_name', label: 'Product Name', type: 'text' },
		 {id: 'brand', label: 'Brand', type: 'text' },
		 {id: 'adulterant', label: 'Adulterant', type: 'text' },
		 {id: 'detection_date', label: 'Detection date', type: 'date' },
		 
	     ].map(({ id, label, type }) => (
		 <div key={id}>
		   <label htmlFor={id} className="block text-sm font-medium text-grey-700">{label}</label>
		   <input type={type} id={id} name={id} required className="mt-1 block w-full rouded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"/>
		 </div>
	     ))}

	     <div>
	     <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
	     <select id="category" name="category" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
	     <option value="" >Select a category</option>
	     <option value="Diary">Diary</option>
	     <option value="Meat">Meat</option>
	     <option value="Spices">Spices</option>
	     <option value="Beverages">Beverages</option>
	     <option value="0ils">Oils</option>
	     </select>
	     </div>

// Detection Line is where i stopped will continue the rest of it tomorrow . 
	     <div>
	     <label htmlFor="detection_method" className="block text-sm font-medium text-gray-700">Detection Method</label>
	     <select id="detection_method" name="detection_method" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
	     <option value="">Select a method</option>
	     <option value="Chemical Analysis">Chemical Analysis</option>
	     <option value="Spectroscopy">Spectroscopy</option>
	     <option value="Chromatography">Chromatography</option>
	     <option value="Visual Inspectation">Visual Inspectation</option>
	     </select>
	     </div>

	     <div>
	     <label htmlFor="severity" className="block text-sm font-medium text-gray-700">Severity</label>
	     <select id="severity" name="severity" reqiuired className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
	     <option value="">Select Severity Level</option>
	     <option value="Low">Low</option>
	     <option value="Medium">Medium</option>
	     <option value="High">High</option>
	     <option value="Critical">Critical</option>
	     </select>
	     </div>


	     <div>
	     <label htmlFor="action_taken" className="block text-sm font-medium text-gray-700">Action Taken</label>
	     <select id="action_taken" name="action_taken" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
	     <option value="Product Recall">Product Recall</option>
	     <option value="Warning Issued">Warning Issued</option>
	     <option value="Further Testing">Further Testing</option>
	     <option value="No Action Required">No Action Required</option>
	     </select>
	     </div>


	     <div>
	     <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Analyze Sample</button>
	     </div>
	   </form>
	 </div>
	</div>
	</div>
	);
};
	     
					      
export default PredictionForm;
