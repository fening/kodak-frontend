import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

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
        const response = await axios.get(`kodaklogisticsapi.up.railway.app/api/records/${id}/`, {
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

  if (error) return <div>Error: {error}</div>;
  if (!record) return <div>Loading...</div>;

  const formatNumber = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  return (
    <div>
      <h2>Record Detail</h2>
      <p>PO Number: {record.po_number}</p>
      <p>Date: {record.date}</p>
      <p>From: {record.location_from}</p>
      <p>To: {record.location_to}</p>
      <p>DH Miles: {formatNumber(record.dh_miles)}</p>
      <p>Miles: {formatNumber(record.miles)}</p>
      <p>Fuel: ${formatNumber(record.fuel)}</p>
      <p>Food: ${formatNumber(record.food)}</p>
      <p>Lumper: ${formatNumber(record.lumper)}</p>
      <p>Pay: ${formatNumber(record.pay)}</p>
      <Link to={`/records/${record.id}/edit`}>Edit</Link>
      <br />
      <Link to="/">Back to List</Link>
    </div>
  );
};

export default RecordDetail;