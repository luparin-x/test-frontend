import { useState } from 'react';
import axios from 'axios';
import { Button, Typography, Box, Alert, TextField } from '@mui/material';
import toast from 'react-hot-toast';
import API_ENDPOINTS from '../config/api';

const BiometricForm = ({ setToken }: { setToken: (token: string) => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [registeredCredentialId, setRegisteredCredentialId] = useState<string | null>(() =>
    localStorage.getItem('biometricCredentialId')
  );

  const generateChallenge = () => new Uint8Array(32).map(() => Math.floor(Math.random() * 255));

  const getDomain = () => {
    const hostname = window.location.hostname;
    // For localhost development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'localhost';
    }
    // For production (Vercel domain)
    return hostname;
  };

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN, {
        username,
        password,
      });
      const accessToken = response.data.access_token;
      localStorage.setItem('accessToken', accessToken);
      setIsAuthenticated(true);
      toast.success('Authentication successful! You can now register or use biometric login.');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricRegister = async () => {
    if (!navigator.credentials) {
      toast.error('WebAuthn is not supported in this browser');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please login first to register biometric authentication');
      return;
    }

    setIsLoading(true);
    try {
      const domain = getDomain();
      const publicKey: PublicKeyCredentialCreationOptions = {
        challenge: generateChallenge(),
        rp: { 
          name: 'Auth Tester',
          id: domain
        },
        user: {
          id: new Uint8Array([1, 2, 3, 4]),
          name: username,
          displayName: username,
        },
        pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
        },
        timeout: 60000,
      };

      const credential = (await navigator.credentials.create({ publicKey })) as PublicKeyCredential;
      const credentialId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));

      // Register with the server using the access token
      const accessToken = localStorage.getItem('accessToken');
      await axios.post(API_ENDPOINTS.BIOMETRIC_REGISTER, 
        { credentialId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      setRegisteredCredentialId(credentialId);
      localStorage.setItem('biometricCredentialId', credentialId);
      toast.success('Fingerprint registered successfully! Now you can log in.');
    } catch (err) {
      console.error('Biometric registration error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`Registration failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    if (!navigator.credentials || !registeredCredentialId) {
      toast.error(!navigator.credentials ? 'WebAuthn not supported' : 'Please register first');
      return;
    }

    setIsLoading(true);
    try {
      const domain = getDomain();
      const publicKey: PublicKeyCredentialRequestOptions = {
        challenge: generateChallenge(),
        allowCredentials: [
          { 
            type: 'public-key',
            id: Uint8Array.from(atob(registeredCredentialId), (c) => c.charCodeAt(0)),
            transports: ['internal']
          },
        ],
        rpId: domain,
        userVerification: 'required',
        timeout: 60000,
      };

      const credential = (await navigator.credentials.get({ publicKey })) as PublicKeyCredential;
      const credentialId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));

      const response = await axios.post(API_ENDPOINTS.BIOMETRIC_LOGIN, {
        biometricToken: { id: credentialId },
      });

      setToken(response.data.access_token);
      toast.success('Fingerprint login successful!');
    } catch (err) {
      console.error('Biometric login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`Login failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ '& > *': { mb: 2 } }}>
      <Typography variant="h6" gutterBottom sx={{ 
        fontWeight: 500,
        color: 'text.primary',
        mb: 2
      }}>
        Fingerprint Authentication
      </Typography>

      {!navigator.credentials && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          WebAuthn is not supported in this browser. Please use a modern browser that supports biometric authentication.
        </Alert>
      )}

      {!isAuthenticated ? (
        <>
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
              mb: 2.5,
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
              background: 'linear-gradient(45deg, #2563eb, #db2777)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1d4ed8, #be185d)',
              },
            }}
          >
            {isLoading ? 'Authenticating...' : 'Authenticate to Enable Biometric'}
          </Button>
        </>
      ) : (
        <>
          {!registeredCredentialId ? (
            <Button 
              onClick={handleBiometricRegister} 
              variant="contained" 
              fullWidth
              disabled={isLoading || !navigator.credentials}
              sx={{
                py: 1.5,
                background: 'linear-gradient(45deg, #2563eb, #db2777)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1d4ed8, #be185d)',
                },
              }}
            >
              {isLoading ? 'Registering...' : 'Register Fingerprint (Touch ID)'}
            </Button>
          ) : (
            <Button 
              onClick={handleBiometricLogin} 
              variant="contained" 
              fullWidth
              disabled={isLoading || !navigator.credentials}
              sx={{
                py: 1.5,
                background: 'linear-gradient(45deg, #2563eb, #db2777)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1d4ed8, #be185d)',
                },
              }}
            >
              {isLoading ? 'Verifying...' : 'Login with Fingerprint (Touch ID)'}
            </Button>
          )}

          {registeredCredentialId && (
            <Button 
              onClick={() => {
                localStorage.removeItem('biometricCredentialId');
                setRegisteredCredentialId(null);
                toast.success('Fingerprint registration cleared');
              }}
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{ mt: 1 }}
            >
              Reset Fingerprint Registration
            </Button>
          )}
        </>
      )}
    </Box>
  );
};

export default BiometricForm;