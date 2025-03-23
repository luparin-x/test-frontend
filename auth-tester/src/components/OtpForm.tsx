import { useState } from 'react';
import axios from 'axios';
import { Button, TextField } from '@mui/material';

const OtpForm = ({ setToken }: { setToken: (token: string) => void }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'generate' | 'verify'>('generate');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleGenerateOtp = async () => {
    try {
      await axios.post('https://thoughtless-carolyne-anveshax-00a36609.koyeb.app/auth/otp/generate', { phone });
      setMessage('OTP sent to your phone');
      setStep('verify');
      setError('');
    } catch (err) {
      setError('Failed to generate OTP');
    }
  };

  const handleOtpLogin = async () => {
    try {
      const response = await axios.post('https://thoughtless-carolyne-anveshax-00a36609.koyeb.app/auth/otp', { phone, otp });
      setToken(response.data.access_token);
      setMessage('OTP login successful!');
      setError('');
    } catch (err) {
      setError('OTP login failed');
    }
  };

  return (
    <div>
      <h2>Phone OTP Login</h2>
      <TextField
        label="Phone (e.g., +1234567890)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        fullWidth
        disabled={step === 'verify'}
      />
      {step === 'generate' ? (
        <Button onClick={handleGenerateOtp} variant="outlined" fullWidth>
          Generate OTP
        </Button>
      ) : (
        <>
          <TextField
            label="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            fullWidth
          />
          <Button onClick={handleOtpLogin} variant="contained" fullWidth>
            Verify OTP
          </Button>
        </>
      )}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default OtpForm;