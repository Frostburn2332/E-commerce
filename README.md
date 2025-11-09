# MERN E-Commerce Application

A modern e-commerce platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- User Authentication (Register/Login)
- Protected Routes
- Modern UI Design
- JWT-based Authentication
- Secure Password Hashing
- MongoDB Database Integration

## Project Structure

```
mern-ecommerce/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/      # Context providers
│   │   ├── styles/       # CSS styles
│   │   └── utils/        # Utility functions
│   └── package.json
└── server/                # Backend Node.js/Express application
    ├── config/           # Configuration files
    ├── controllers/      # Route controllers
    ├── middleware/       # Custom middleware
    ├── models/          # Database models
    ├── routes/          # API routes
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mern-ecommerce
   ```

2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install client dependencies:
   ```bash
   cd ../client
   npm install
   ```

4. Create a .env file in the server directory:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mern-ecommerce
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   ```

### Running the Application

1. Start the server:
   ```bash
   cd server
   npm run dev
   ```

2. Start the client:
   ```bash
   cd client
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication

- POST `/api/auth/register` - Register a new user
  - Body: `{ name, email, password }`
- POST `/api/auth/login` - Login user
  - Body: `{ email, password }`
- GET `/api/auth/me` - Get current user profile (Protected)

## Security Features

- Password Hashing (bcryptjs)
- JWT Authentication
- Protected Routes
- Input Validation
- CORS Enabled

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.