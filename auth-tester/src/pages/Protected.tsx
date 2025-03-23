import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Protected = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    // Example protected endpoint (you'd need to create this in NestJS)
    axios
      .get('https://thoughtless-carolyne-anveshax-00a36609.koyeb.app/protected', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setMessage(response.data.message))
      .catch(() => navigate('/'));
  }, [token, navigate]);

  return (
    <div>
      <h1>Protected Page</h1>
      <p>{message || 'Loading...'}</p>
    </div>
  );
};

export default Protected;