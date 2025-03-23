import { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Box, Typography } from '@mui/material';
import toast from 'react-hot-toast';

const RegisterForm = ({ setToken }: { setToken: (token: string) => void }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!username || !email || !phone || !password) {
      toast.error('Please fill in all fields');
      return false;
    }
    if (!email.includes('@')) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post('https://thoughtless-carolyne-anveshax-00a36609.koyeb.app/auth/register', {
        username,
        email,
        phone,
        password,
      });
      setToken(response.data.access_token);
      toast.success('Registration successful!');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ '& > *': { mb: 2.5 } }}>
      <Typography variant="h5" gutterBottom sx={{ 
        fontWeight: 500,
        background: 'linear-gradient(45deg, #2563eb, #db2777)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        mb: 3,
      }}>
        Create Account
      </Typography>

      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        variant="outlined"
        sx={{
          mb: 2.5,
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          },
        }}
      />

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        variant="outlined"
        sx={{
          mb: 2.5,
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          },
        }}
      />

      <TextField
        label="Phone"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        fullWidth
        variant="outlined"
        sx={{
          mb: 2.5,
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          },
        }}
      />

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        variant="outlined"
        helperText="Password must be at least 6 characters long"
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          },
        }}
      />

      <Button 
        onClick={handleRegister} 
        variant="contained" 
        fullWidth
        disabled={isLoading}
        sx={{
          py: 1.5,
          mt: 1,
          fontWeight: 500,
          fontSize: '1rem',
          textTransform: 'none',
          background: 'linear-gradient(45deg, #2563eb, #db2777)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1d4ed8, #be185d)',
          },
        }}
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </Box>
  );
};

export default RegisterForm;