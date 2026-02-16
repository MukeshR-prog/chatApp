# ChatterBox - Real-Time Chat Application

A full-stack MERN (MongoDB, Express.js, React, Node.js) real-time chat application with Socket.IO for instant messaging.

![ChatterBox](https://img.shields.io/badge/ChatterBox-Chat%20App-purple)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![React](https://img.shields.io/badge/React-v19-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-black)

## Features

- **User Authentication** - Secure signup/login with JWT tokens
- **Real-Time Messaging** - Instant messages using Socket.IO
- **Direct Messages (DM)** - Private one-on-one conversations
- **Channel/Group Chats** - Create and manage group conversations
- **Profile Management** - Customize your profile with avatar and colors
- **File Sharing** - Upload and share files in conversations
- **Emoji Support** - Express yourself with emoji picker
- **Responsive Design** - Works seamlessly on desktop and mobile

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **Zustand** - State management
- **React Router v7** - Client-side routing
- **Radix UI** - Accessible UI components
- **Socket.IO Client** - Real-time client
- **Axios** - HTTP client
- **Lucide React / React Icons** - Icon libraries
- **Emoji Picker React** - Emoji selection
- **Sonner** - Toast notifications

## Project Structure

```
chatApp/
├── backend/                  # Express.js backend
│   ├── controllers/          # Route controllers
│   │   ├── authController.js
│   │   ├── channelController.js
│   │   ├── contactsController.js
│   │   └── messagesController.js
│   ├── middlewares/          # Express middlewares
│   │   └── authMiddleware.js
│   ├── models/               # Mongoose models
│   │   ├── channelModel.js
│   │   ├── messegasModel.js
│   │   └── userModel.js
│   ├── routes/               # API routes
│   │   ├── authRoutes.js
│   │   ├── channelRoutes.js
│   │   ├── contactRoutes.js
│   │   └── messagesRoutes.js
│   ├── uploads/              # Uploaded files storage
│   ├── index.js              # Server entry point
│   ├── socket.js             # Socket.IO configuration
│   └── package.json
│
└── client/                   # React frontend
    ├── public/               # Static assets
    ├── src/
    │   ├── assets/           # Images, animations
    │   ├── components/       # Reusable components
    │   │   ├── ui/           # UI primitives (Button, Input, etc.)
    │   │   └── contact-list.jsx
    │   ├── context/          # React contexts
    │   │   └── socketContext.jsx
    │   ├── lib/              # Utilities
    │   │   ├── api-client.js
    │   │   └── utils.js
    │   ├── pages/            # Page components
    │   │   ├── auth/         # Login/Signup
    │   │   ├── chat/         # Main chat interface
    │   │   └── profile/      # User profile
    │   ├── store/            # Zustand store
    │   │   ├── slices/
    │   │   └── index.js
    │   ├── utils/            # Constants
    │   ├── App.jsx           # Main app component
    │   └── main.jsx          # Entry point
    ├── index.html
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js v18 or higher
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chatApp
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory:
   ```env
   PORT=8747
   DATABASE_URL=mongodb://localhost:27017/chatapp
   JWT_KEY=your_super_secret_jwt_key
   ORIGIN=http://localhost:5173
   NODE_ENV=development
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   ```

   Create a `.env` file in the client directory:
   ```env
   VITE_SERVER_URL=http://localhost:8747
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev    # Development with nodemon
   # or
   npm start      # Production
   ```

2. **Start the Frontend Development Server**
   ```bash
   cd client
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8747

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/userInfo` | Get current user info |
| POST | `/api/auth/update-profile` | Update user profile |
| POST | `/api/auth/add-profile-image` | Upload profile image |
| DELETE | `/api/auth/remove-profile-image` | Remove profile image |
| POST | `/api/auth/logout` | User logout |

### Contacts
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contacts/search` | Search for contacts |
| GET | `/api/contacts/get-contacts-for-dm` | Get DM contacts |
| GET | `/api/contacts/get-all-contacts` | Get all contacts |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/messages/get-messages` | Get messages for a conversation |
| POST | `/api/messages/upload-file` | Upload a file |

### Channels
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/channel/create-channel` | Create a new channel |
| GET | `/api/channel/get-user-channels` | Get user's channels |
| GET | `/api/channel/get-channal-messages/:channelId` | Get channel messages |

## Socket Events

### Client to Server
- `sendMessage` - Send a direct message
- `send-channel-message` - Send a channel message

### Server to Client
- `recieveMessage` - Receive a direct message
- `recieve-channel-message` - Receive a channel message

## Deployment

The application includes Vercel configuration files for easy deployment:

- `backend/vercel.json` - Backend deployment config
- `client/vercel.json` - Frontend deployment config

### Production Build

```bash
# Frontend build
cd client
npm run build
```

## Environment Variables

### Backend (.env)
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 8747) |
| `DATABASE_URL` | MongoDB connection string |
| `JWT_KEY` | Secret key for JWT tokens |
| `ORIGIN` | Allowed CORS origin |
| `NODE_ENV` | Environment (development/production) |

### Frontend (.env)
| Variable | Description |
|----------|-------------|
| `VITE_SERVER_URL` | Backend API URL |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

---

Built with ❤️ using the MERN Stack
