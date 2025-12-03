# 👨‍💻 Developer Directory App
Live Demo--

---

## 🌟 Features

### Core Functionality
- **Create** developer profiles with name, role, tech stack, and experience
- **Read** and display all developers in a responsive card layout
- **Update** developer information with inline edit forms
- **Delete** developer profiles with confirmation

### Advanced Features
- 🔍 **Search** by technology stack (React, Node.js, MongoDB, etc.)
- 🎯 **Filter** by role (Frontend, Backend, Full-Stack)
- ⚡ **Debounced search** for optimized performance
- 🎨 **Responsive UI** with Tailwind CSS
- ✅ **Form validation** on both client and server

---

## 🛠 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React (Vite), Tailwind CSS, Fetch API |
| **Backend** | Node.js, Express.js, Mongoose |
| **Database** | MongoDB Atlas |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## 📂 Project Structure

```
developer-directory/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── .env                 # Environment variables
│   └── package.json
│
├── backend/                  # Express API
│   ├── models/
│   │   └── Developer.js     # Mongoose schema
│   ├── index.js             # Express server
│   ├── .env                 # Environment variables
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Git

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   CORS_ORIGIN=http://.."
   PORT=...
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```
   
   Backend will run at: `http://localhost:..`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```env
   VITE_API_URL=http://..."
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   Frontend will run at: `http://.."`

---

## 🌐 API Documentation

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/developers` | Fetch all developers |
| `POST` | `/developers` | Create a new developer |
| `PUT` | `/developers/:id` | Update a developer by ID |
| `DELETE` | `/developers/:id` | Delete a developer by ID |

### Request Examples

**Create Developer (POST)**
```json
{
  "name": "John Doe",
  "role": "Full-Stack",
  "techStack": ["React", "Node.js", "MongoDB"],
  "experience": 3
}
```

**Update Developer (PUT)**
```json
{
  "name": "John Doe",
  "role": "Backend",
  "techStack": ["Node.js", "Express", "PostgreSQL"],
  "experience": 4
}
```

---

## ☁️ Deployment

### Deploy Backend to Render

1. Push your code to GitHub
2. Go to [Render](https://render.com) → **New Web Service**
3. Connect your GitHub repository
4. Configure settings:
   - **Root Directory**: `backend`
   - **Build Command**: (leave empty or `npm install`)
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `MONGODB_URI`: Your MongoDB connection string
     - `CORS_ORIGIN`: Your Vercel frontend URL

5. Deploy and copy your backend URL

### Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Configure settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     - `VITE_API_URL`: Your Render backend URL

4. Deploy and access your live app!

---

## 📚 Learning Outcomes

This project teaches:

- ✅ Full-stack MERN architecture
- ✅ RESTful API design and implementation
- ✅ MongoDB schema design with Mongoose
- ✅ React state management with hooks
- ✅ Form validation (client & server-side)
- ✅ CRUD operations implementation
- ✅ Environment variable configuration
- ✅ CORS and security basics
- ✅ Deployment workflows (Vercel + Render)
- ✅ Professional project structure

---

## 🎯 Future Enhancements

- [ ] User authentication with JWT
- [ ] Profile picture uploads (Cloudinary)
- [ ] Dark mode toggle


---

## 📝 License

This project is licensed under the MIT License - feel free to use it for learning and personal projects.

---

## 👤 Author

Built with ❤️ for learning full-stack development

**Feedback?** Open an issue or submit a pull request!

---

## 🙏 Acknowledgments

- MongoDB documentation
- Express.js guides
- React official docs
- Tailwind CSS
- The full-stack development community

---

### ⭐ If you found this helpful, give it a star!