import { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Box, Typography } from '@mui/material';
import toast from 'react-hot-toast';

const LoginForm = ({ setToken }: { setToken: (token: string) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('https://thoughtless-carolyne-anveshax-00a36609.koyeb.app/auth/login', {
        username,
        password,
      });
      setToken(response.data.access_token);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
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
        Welcome Back
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
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        variant="outlined"
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          },
        }}
      />

      <Button 
        onClick={handleLogin} 
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
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
    </Box>
  );
};

export default LoginForm;