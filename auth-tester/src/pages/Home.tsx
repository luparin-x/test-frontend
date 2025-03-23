import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tabs,
  Tab,
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Divider,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import { Toaster, toast } from 'react-hot-toast';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import GoogleLoginButton from '../components/GoogleLoginButton';
import OtpForm from '../components/OtpForm';
import BiometricForm from '../components/BiometricForm';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Home = () => {
  const [token, setToken] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSetToken = (newToken: string | null) => {
    setToken(newToken);
    if (newToken) {
      toast.success('Successfully logged in!', {
        duration: 3000,
        position: 'top-right',
      });
    }
  };

  if (token) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', py: 4 }}>
        <Card 
          elevation={3}
          sx={{ 
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #2563eb, #db2777)',
            }}
          />
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ 
              background: 'linear-gradient(45deg, #2563eb, #db2777)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3,
            }}>
              Login Successful! 🎉
            </Typography>
            
            <Alert 
              severity="success" 
              sx={{ 
                mb: 4,
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                '& .MuiAlert-icon': {
                  color: '#22c55e',
                },
              }}
            >
              You have been successfully authenticated
            </Alert>

            <Box sx={{ mb: 4, p: 2, backgroundColor: 'rgba(37, 99, 235, 0.05)', borderRadius: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Your Access Token:
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  wordBreak: 'break-all',
                  fontFamily: 'monospace',
                  p: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  borderRadius: 1,
                  border: '1px solid rgba(37, 99, 235, 0.1)',
                }}
              >
                {token}
              </Typography>
            </Box>

            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={6}>
                <Button
                  onClick={() => navigate('/protected')}
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  sx={{ mb: { xs: 2, sm: 0 } }}
                >
                  Go to Protected Page
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  onClick={() => {
                    setToken(null);
                    toast.success('Logged out successfully!');
                  }}
                  variant="outlined"
                  color="secondary"
                  size="large"
                  fullWidth
                >
                  Logout
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h1" align="center" gutterBottom>
        Welcome
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Please choose your preferred authentication method
      </Typography>
      
      <Paper elevation={3} sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Login" />
          <Tab label="Register" />
          <Tab label="Other Methods" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <LoginForm setToken={handleSetToken} />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <RegisterForm setToken={handleSetToken} />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <Typography variant="h6" gutterBottom>
                Alternative Authentication Methods
              </Typography>
            </Grid>
            <Grid item>
              <GoogleLoginButton />
            </Grid>
            <Grid item>
              <Divider sx={{ my: 2 }}>OR</Divider>
            </Grid>
            <Grid item>
              <OtpForm setToken={handleSetToken} />
            </Grid>
            <Grid item>
              <Divider sx={{ my: 2 }}>OR</Divider>
            </Grid>
            <Grid item>
              <BiometricForm setToken={handleSetToken} />
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
      <Toaster />
    </Box>
  );
};

export default Home;