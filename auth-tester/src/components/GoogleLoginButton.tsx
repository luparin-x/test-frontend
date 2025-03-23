const GoogleLoginButton = () => {
    const handleGoogleLogin = () => {
      window.location.href = 'https://thoughtless-carolyne-anveshax-00a36609.koyeb.app/auth/google';
    };
  
    return (
      <div>
        <h2>Google Login</h2>
        <button onClick={handleGoogleLogin}>Login with Google</button>
      </div>
    );
  };
  
  export default GoogleLoginButton;