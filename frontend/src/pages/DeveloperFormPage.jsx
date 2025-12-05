import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  createDeveloper,
  getDeveloperById,
  updateDeveloper
} from '../services/developerService';
import Spinner from '../components/Spinner';


const ROLE_OPTIONS = ['Frontend', 'Backend', 'Full-Stack', 'Data Analyst', 'Devops'];

const DeveloperFormPage = ({ mode = 'create' }) => {
  const isEdit = mode === 'edit';
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    role: 'Frontend',
    techStack: '',
    experience: '',
    description: '',
    joiningDate: '',
    photoUrl: ''
  });

  const [loading, setLoading] = useState(isEdit); // if edit, we load existing data
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Load developer for edit mode
  useEffect(() => {
    const loadDeveloper = async () => {
      if (!isEdit || !id) return;
      try {
        setLoading(true);
        const dev = await getDeveloperById(id);

        setForm({
          name: dev.name || '',
          role: dev.role || 'Frontend',
          techStack: Array.isArray(dev.techStack)
            ? dev.techStack.join(', ')
            : dev.techStack || '',
          experience: dev.experience ?? '',
          description: dev.description || '',
          joiningDate: dev.joiningDate
            ? new Date(dev.joiningDate).toISOString().split('T')[0]
            : '',
          photoUrl: dev.photoUrl || ''
        });
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message ||
            'Failed to load developer details for editing.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadDeveloper();
  }, [isEdit, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    // prepare payload for backend
    const payload = {
      ...form,
      experience: Number(form.experience)
    };

    try {
      if (isEdit) {
        await updateDeveloper(id, payload);
      } else {
        await createDeveloper(payload);
      }

      navigate('/developers');
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          `Failed to ${isEdit ? 'update' : 'create'} developer.`
      );
    } finally {
      setSaving(false);
    }
  };

 if (loading) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <Spinner text="Loading developer..." />
      </main>
    </div>
  );
}


  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-2">
          {isEdit ? 'Edit Developer' : 'Add Developer'}
        </h1>
        <p className="text-sm text-slate-600 mb-4">
          {isEdit
            ? 'Update the details of this developer.'
            : 'Fill in the details to add a new developer.'}
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg shadow-sm border">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder="Developer name"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-medium mb-1">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm bg-white"
              required
            >
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Tech stack */}
          <div>
            <label className="block text-xs font-medium mb-1">
              Tech Stack (comma-separated)
            </label>
            <input
              type="text"
              name="techStack"
              value={form.techStack}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder="React, Node.js, MongoDB"
              required
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Enter skills separated by commas. They&apos;ll be shown as tags.
            </p>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-xs font-medium mb-1">
              Experience (years)
            </label>
            <input
              type="number"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm"
              min="0"
              step="0.5"
              required
            />
          </div>

          {/* Joining date */}
          <div>
            <label className="block text-xs font-medium mb-1">
              Joining Date
            </label>
            <input
              type="date"
              name="joiningDate"
              value={form.joiningDate}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* Photo URL */}
          <div>
            <label className="block text-xs font-medium mb-1">
              Photo URL (optional)
            </label>
            <input
              type="url"
              name="photoUrl"
              value={form.photoUrl}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder="https://..."
            />
            <p className="text-[11px] text-slate-500 mt-1">
              You can host images on services like Cloudinary, Imgur, etc.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium mb-1">
              Description / About
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm min-h-[100px]"
              placeholder="Short description about the developer's experience and skills."
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => navigate('/developers')}
              className="px-4 py-2 text-sm rounded-md border border-slate-300 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {saving
                ? isEdit
                  ? 'Updating...'
                  : 'Creating...'
                : isEdit
                ? 'Update Developer'
                : 'Create Developer'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default DeveloperFormPage;
