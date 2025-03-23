import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Callback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      axios
        .get(`https://thoughtless-carolyne-anveshax-00a36609.koyeb.app/auth/google/callback?code=${code}`)
        .then((response) => {
          const token = response.data.access_token;
          if (token) {
            localStorage.setItem('token', token); // Store token for simplicity
            navigate('/');
          }
        })
        .catch((err) => console.error('Callback error:', err));
    }
  }, [searchParams, navigate]);

  return <div>Processing Google login...</div>;
};

export default Callback;
