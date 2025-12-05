import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getDeveloperById } from '../services/developerService';

const DeveloperProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [developer, setDeveloper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDeveloper = async () => {
      try {
        setLoading(true);
        const dev = await getDeveloperById(id);
        setDeveloper(dev);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message ||
            'Failed to load developer profile. Try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadDeveloper();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString();
  };

 if (loading) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Spinner text="Loading profile..." />
      </main>
    </div>
  );
}


  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-6">
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-md">
            {error}
          </div>
          <button
            onClick={() => navigate('/developers')}
            className="px-4 py-2 text-sm rounded-md border border-slate-300 hover:bg-slate-100"
          >
            Back to directory
          </button>
        </main>
      </div>
    );
  }

  if (!developer) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-6">
          <p className="text-sm text-slate-600">Developer not found.</p>
          <button
            onClick={() => navigate('/developers')}
            className="mt-3 px-4 py-2 text-sm rounded-md border border-slate-300 hover:bg-slate-100"
          >
            Back to directory
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate('/developers')}
          className="text-xs mb-3 text-blue-600 hover:underline"
        >
          ← Back to directory
        </button>

        <div className="bg-white border rounded-lg shadow-sm p-6 flex flex-col md:flex-row gap-6">
          {/* Left: photo & basic info */}
          <div className="w-full md:w-1/3 flex flex-col items-center md:items-start">
            <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden mb-3">
              {developer.photoUrl ? (
                <img
                  src={developer.photoUrl}
                  alt={developer.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <span className="text-3xl font-semibold text-slate-500">
                  {developer.name?.charAt(0)?.toUpperCase() || '?'}
                </span>
              )}
            </div>

            <h1 className="text-2xl font-semibold mb-1">{developer.name}</h1>
            <p className="text-sm text-slate-700 mb-1">{developer.role}</p>
            <p className="text-xs text-slate-500 mb-2">
              Experience: {developer.experience} years
            </p>

            <p className="text-xs text-slate-500">
              Joining date: {formatDate(developer.joiningDate)}
            </p>
          </div>

          {/* Right: details */}
          <div className="w-full md:w-2/3 space-y-4">
            {/* Tech stack */}
            <div>
              <h2 className="text-sm font-semibold mb-1">Tech Stack</h2>
              {developer.techStack && developer.techStack.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {developer.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No tech stack specified.</p>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-sm font-semibold mb-1">About</h2>
              <p className="text-sm text-slate-700 whitespace-pre-line">
                {developer.description || 'No description provided.'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Link
                to={`/developers/${developer._id}/edit`}
                className="px-4 py-2 text-sm rounded-md border border-slate-300 hover:bg-slate-100"
              >
                Edit Profile
              </Link>
              <Link
                to="/developers"
                className="px-4 py-2 text-sm rounded-md bg-slate-900 text-white hover:bg-slate-800"
              >
                Back to Directory
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeveloperProfilePage;
