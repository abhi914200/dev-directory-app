import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/developers" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight">
            Developer Directory
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <div className="text-sm text-slate-700">
              Logged in as <span className="font-semibold">{user.name}</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1.5 rounded-md border border-slate-300 hover:bg-slate-100"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
