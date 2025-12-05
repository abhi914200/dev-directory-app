import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DeveloperListPage from './pages/DeveloperListPage';
import DeveloperProfilePage from './pages/DeveloperProfilePage';
import DeveloperFormPage from './pages/DeveloperFormPage'; // NEW

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DeveloperListPage />} />
            <Route path="/developers" element={<DeveloperListPage />} />
            <Route path="/developers/new" element={<DeveloperFormPage mode="create" />} />
            <Route path="/developers/:id" element={<DeveloperProfilePage />} />
            <Route path="/developers/:id/edit" element={<DeveloperFormPage mode="edit" />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<DeveloperListPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
