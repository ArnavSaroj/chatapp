# 💬 CHATTY TOP Chat Application
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/ArnavSaroj/chatapp)

Chatty Top is a real-time chat application built with the PERN (PostgreSQL, Express, React, Node.js) stack, designed for seamless communication. It features user authentication, real-time messaging with text and images, online user status, and a customizable theme interface.

## 🚀 Features

*   Secure User Authentication (Signup, Login, Logout) with JWT.
*   Real-time 1-on-1 Messaging with Socket.IO.
*   Text and Image Message Support (images uploaded via Cloudinary).
*   Display of Online User Status.
*   User Profile Management (update profile picture).
*   Persistent UI Theme Customization (Light/Dark modes and various DaisyUI themes).
*   Responsive User Interface built with React and Tailwind CSS (using DaisyUI).
*   Client-side state management with Zustand.
*   API built with Node.js and Express.js.
*   PostgreSQL database for data persistence.

## 🛠️ Tech Stack

*   **Frontend**: React.js, Zustand, Tailwind CSS (with DaisyUI), Socket.IO Client, Axios, Vite
*   **Backend**: Node.js, Express.js, PostgreSQL, Socket.IO, JWT, Bcrypt.js, Cloudinary SDK
*   **Database**: PostgreSQL

## Environment Variables

The application requires environment variables to be set up for the backend.

**Backend (`backend/.env`)**:
Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
JWT_SECRET=your_strong_jwt_secret_key
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_HOST=your_db_host
DATABASE_NAME=your_db_name
DATABASE_PORT=5432 # Or your PostgreSQL port
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development # Use 'production' for deployment
```

## Database Setup

The application uses a PostgreSQL database. Ensure you have PostgreSQL installed and running.
You'll need to create a database (e.g., `gupshup_db`) and then create the following tables within it:

1.  **`users` table**:
    ```sql
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        fullname VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        profile_pic TEXT, -- Stores URL from Cloudinary
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    ```

2.  **`messages` table**:
    ```sql
    CREATE TABLE messages (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        text TEXT,
        image TEXT, -- Stores URL from Cloudinary
        sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    ```
    *Consider adding an index for message retrieval performance:*
    ```sql
    CREATE INDEX idx_messages_conversation ON messages (LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id), sent_at);
    ```

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/arnavsaroj/chatapp.git
    cd chatapp
    ```

2.  **Setup Backend**:
    ```bash
    cd backend
    npm install
    # Create and configure your .env file as described in the "Environment Variables" section.
    # Ensure your PostgreSQL database is set up as per the "Database Setup" section.
    cd ..
    ```

3.  **Setup Frontend**:
    ```bash
    cd frontend
    npm install
    cd ..
    ```

## Running the Application

### Development Mode

This mode is recommended for development as it provides hot-reloading.

1.  **Start the Backend Server**:
    Open a terminal in the `backend` directory:
    ```bash
    npm run dev
    ```
    The backend will typically run on `http://localhost:5000` (or the `PORT` specified in `backend/.env`).

2.  **Start the Frontend Development Server**:
    Open a new terminal in the `frontend` directory:
    ```bash
    npm run dev
    ```
    The frontend will run on `http://localhost:5173` by default and is configured to proxy API requests to the backend.

### Production Mode

To build the application for production and run it:

1.  **Build the Application**:
    From the root directory (`chatapp/`):
    ```bash
    npm run build
    ```
    This command installs dependencies for both frontend and backend, then builds the frontend. The static assets will be placed in `frontend/dist`.

2.  **Start the Server**:
    From the root directory (`chatapp/`):
    ```bash
    npm start
    ```
    This starts the backend server, which is configured to serve the frontend static files in production mode. Access the application at `http://localhost:PORT` (where `PORT` is defined in `backend/.env`).

## Available Scripts (from root `package.json`)

*   `npm run build`: Installs dependencies for both backend and frontend and builds the frontend for production.
*   `npm start`: Starts the backend server (Node.js). In production, this server also serves the built frontend.

## Project Structure Overview
```
arnavsaroj-chatapp/
├── README.md         # This file
├── package.json      # Root project configuration, build/start scripts
├── backend/
│   ├── package.json  # Backend dependencies and scripts
│   └── src/
│       ├── index.js  # Backend server entry point
│       ├── controllers/ # Request handlers for API endpoints
│       ├── lib/         # Database connection, Cloudinary config, Socket.io setup
│       ├── middleware/  # Express middleware (e.g., authentication)
│       └── routes/      # API route definitions
└── frontend/
    ├── package.json  # Frontend dependencies and scripts (Vite)
    ├── vite.config.js # Vite configuration
    ├── index.html    # Main HTML page for the React application
    └── src/
        ├── App.jsx       # Main React application component with routing
        ├── main.jsx      # React application entry point
        ├── components/   # Reusable UI components (Navbar, Sidebar, Chat, etc.)
        ├── pages/        # Page-level components (Homepage, Login, Signup, etc.)
        ├── store/        # Zustand state management stores (auth, chat, theme)
        ├── lib/          # Utility functions, Axios instance
        └── constants/    # Application-wide constants (e.g., theme list)
```

## License

This project is licensed under the ISC License.
