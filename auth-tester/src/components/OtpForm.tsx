import { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Box, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import API_ENDPOINTS from '../config/api';

const OtpForm = ({ setToken }: { setToken: (token: string) => void }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);

  const handleRequestOtp = async () => {
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(API_ENDPOINTS.OTP_REQUEST, { email });
      setOtpRequested(true);
      toast.success('OTP sent to your email!');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to send OTP. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(API_ENDPOINTS.OTP_VERIFY, {
        email,
        otp,
      });
      setToken(response.data.access_token);
      toast.success('OTP verified successfully!');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Invalid OTP. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ '& > *': { mb: 2.5 } }}>
      <Typography variant="h6" gutterBottom sx={{ 
        fontWeight: 500,
        color: 'text.primary',
        mb: 2
      }}>
        OTP Authentication
      </Typography>

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={otpRequested}
        fullWidth
        variant="outlined"
        sx={{
          mb: 2.5,
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          },
        }}
      />

      {!otpRequested ? (
        <Button 
          onClick={handleRequestOtp} 
          variant="contained" 
          fullWidth
          disabled={isLoading}
          sx={{
            py: 1.5,
            background: 'linear-gradient(45deg, #2563eb, #db2777)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1d4ed8, #be185d)',
            },
          }}
        >
          {isLoading ? 'Sending OTP...' : 'Send OTP'}
        </Button>
      ) : (
        <>
          <TextField
            label="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              mb: 2.5,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
              },
            }}
          />
          <Button 
            onClick={handleVerifyOtp}
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{
              py: 1.5,
              background: 'linear-gradient(45deg, #2563eb, #db2777)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1d4ed8, #be185d)',
              },
            }}
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </Button>
          <Button
            onClick={() => {
              setOtpRequested(false);
              setOtp('');
            }}
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mt: 1 }}
          >
            Request New OTP
          </Button>
        </>
      )}
    </Box>
  );
};

export default OtpForm;