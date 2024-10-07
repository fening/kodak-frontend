import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

interface Record {
  id: number;
  date: string;
  po_number: string;
  location_from: string;
  location_to: string;
  dh_miles: string | number;
  miles: string | number;
  fuel: string | number;
  food: string | number;
  lumper: string | number;
  pay: string | number;
}

const RecordDetail: React.FC = () => {
  const [record, setRecord] = useState<Record | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const response = await axios.get(`https://kodaklogisticsapi.up.railway.app/api/records/${id}/`, {
          headers: {
            Authorization: `Bearer ${user.access}`,
          },
        });
        setRecord(response.data);
      } catch (error) {
        console.error('There was an error fetching the record!', error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setError('Your session has expired. Please log in again.');
          setTimeout(() => navigate('/login'), 3000);
        } else {
          setError('An error occurred while fetching the record. Please try again.');
        }
      }
    };

    fetchRecord();
  }, [id, navigate]);

  const formatNumber = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
      <p>{error}</p>
    </div>
  );
  
  if (!record) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-2xl mx-auto">
        <div className="px-6 py-4 bg-gray-100 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Record Detail</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">PO Number</p>
              <p className="font-medium text-gray-800">{record.po_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-medium text-gray-800">{record.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">From</p>
              <p className="font-medium text-gray-800">{record.location_from}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">To</p>
              <p className="font-medium text-gray-800">{record.location_to}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">DH Miles</p>
              <p className="font-medium text-gray-800">{formatNumber(record.dh_miles)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Miles</p>
              <p className="font-medium text-gray-800">{formatNumber(record.miles)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fuel</p>
              <p className="font-medium text-gray-800">${formatNumber(record.fuel)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Food</p>
              <p className="font-medium text-gray-800">${formatNumber(record.food)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Lumper</p>
              <p className="font-medium text-gray-800">${formatNumber(record.lumper)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Pay</p>
              <p className="font-medium text-gray-800">${formatNumber(record.pay)}</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-100 border-t border-gray-200 flex justify-between">
          <Link 
            to="/" 
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
          >
            Back to List
          </Link>
          <Link 
            to={`/records/${record.id}/edit`} 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecordDetail;