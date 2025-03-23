import { useState } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';

const BiometricForm = ({ setToken }: { setToken: (token: string) => void }) => {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [registeredCredentialId, setRegisteredCredentialId] = useState<string | null>(() =>
    localStorage.getItem('biometricCredentialId')
  );

  const generateChallenge = () => new Uint8Array(32).map(() => Math.floor(Math.random() * 255));

  const handleBiometricRegister = async () => {
    if (!navigator.credentials) {
      setError('WebAuthn is not supported in this browser');
      return;
    }

    try {
      const publicKey: PublicKeyCredentialCreationOptions = {
        challenge: generateChallenge(),
        rp: { name: 'Auth Tester', id: 'localhost' },
        user: {
          id: new Uint8Array([1, 2, 3, 4]),
          name: 'user@example.com',
          displayName: 'Test User',
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

      // Register with the server
      await axios.post('https://thoughtless-carolyne-anveshax-00a36609.koyeb.app/auth/biometric/register', { credentialId });

      setRegisteredCredentialId(credentialId);
      localStorage.setItem('biometricCredentialId', credentialId);
      setMessage('Fingerprint registered successfully! Now you can log in.');
      setError('');
    } catch (err) {
      setError('Registration failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleBiometricLogin = async () => {
    if (!navigator.credentials || !registeredCredentialId) {
      setError(!navigator.credentials ? 'WebAuthn not supported' : 'Please register first');
      return;
    }

    try {
      const publicKey: PublicKeyCredentialRequestOptions = {
        challenge: generateChallenge(),
        allowCredentials: [
          { type: 'public-key', id: Uint8Array.from(atob(registeredCredentialId), (c) => c.charCodeAt(0)) },
        ],
        userVerification: 'required',
        timeout: 60000,
      };

      const credential = (await navigator.credentials.get({ publicKey })) as PublicKeyCredential;
      const credentialId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));

      const response = await axios.post('https://thoughtless-carolyne-anveshax-00a36609.koyeb.app/auth/biometric', {
        biometricToken: { id: credentialId },
      });

      setToken(response.data.access_token);
      setMessage('Fingerprint login successful!');
      setError('');
    } catch (err) {
      setError('Fingerprint login failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  return (
    <div>
      <h2>Fingerprint Login</h2>
      {!registeredCredentialId ? (
        <Button onClick={handleBiometricRegister} variant="contained" fullWidth>
          Register Fingerprint (Touch ID)
        </Button>
      ) : (
        <Button onClick={handleBiometricLogin} variant="contained" fullWidth>
          Login with Fingerprint (Touch ID)
        </Button>
      )}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default BiometricForm;