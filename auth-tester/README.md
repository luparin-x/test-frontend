# Auth Tester

A modern authentication testing application built with React, Material-UI, and TypeScript.

## Docker Deployment

### Prerequisites

- Docker
- Docker Compose (optional)

### Building and Running with Docker

1. Build the Docker image:
```bash
docker build -t your-dockerhub-username/auth-tester:latest .
```

2. Run the container:
```bash
docker run -d -p 80:80 your-dockerhub-username/auth-tester:latest
```

### Using Docker Compose

1. Start the application:
```bash
docker-compose up -d
```

2. Stop the application:
```bash
docker-compose down
```

### Pushing to Docker Hub

1. Login to Docker Hub:
```bash
docker login
```

2. Push the image:
```bash
docker push your-dockerhub-username/auth-tester:latest
```

## Development

### Local Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

### Environment Variables

The application uses the following environment variables:

- `VITE_API_URL`: API base URL (default: https://thoughtless-carolyne-anveshax-00a36609.koyeb.app)

## Features

- Multiple authentication methods:
  - Username/Password login
  - Registration
  - Google OAuth
  - OTP verification
  - Biometric authentication
- Modern UI with Material Design
- Responsive layout
- Toast notifications
- Form validation
- Loading states
- Error handling

## Tech Stack

- React
- TypeScript
- Material-UI
- Vite
- Axios
- React Router
- React Hot Toast

## Production Deployment

The application is containerized and can be deployed to any container orchestration platform. The Docker image is optimized for production with:

- Multi-stage builds
- Nginx for serving static files
- Gzip compression
- Security headers
- Cache control
- Asset optimization

## Security Features

- CSRF protection
- XSS prevention
- Content Security Policy
- Secure headers
- HTTPS enforcement
- Rate limiting
- Input validation
