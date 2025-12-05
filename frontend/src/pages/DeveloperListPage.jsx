import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { fetchDevelopers, deleteDeveloper } from '../services/developerService';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';



const ROLE_OPTIONS = ['All', 'Frontend', 'Backend', 'Full-Stack', 'Data Analyst', 'Devops'];

const SORT_OPTIONS = [
  { value: 'experience_desc', label: 'Experience (High → Low)' },
  { value: 'experience_asc', label: 'Experience (Low → High)' },
  { value: 'createdAt_desc', label: 'Newest first' },
  { value: 'createdAt_asc', label: 'Oldest first' }
];

const DeveloperListPage = () => {
  const [developers, setDevelopers] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 6,
    totalPages: 1
  });

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [sort, setSort] = useState('experience_desc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const loadDevelopers = async ({
    page = pagination.page,
    limit = pagination.limit
  } = {}) => {
    setLoading(true);
    setError('');

    try {
      const [sortBy, sortOrder] = sort.split('_');

      const params = {
        search,
        role: roleFilter === 'All' ? '' : roleFilter,
        sortBy,
        sortOrder,
        page,
        limit
      };

      const res = await fetchDevelopers(params);
      setDevelopers(res.data);
      setPagination(res.pagination);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || 'Failed to load developers. Try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Load when page loads or filters/sort/search change
  useEffect(() => {
    loadDevelopers({ page: 1, limit: pagination.limit });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, roleFilter, sort]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    loadDevelopers({ page: newPage, limit: pagination.limit });
  };

  const handleDelete = async (id) => {
  const confirmed = window.confirm(
    'Are you sure you want to delete this developer?'
  );
  if (!confirmed) return;

  try {
    await deleteDeveloper(id);
    toast.success('Developer deleted successfully');
    loadDevelopers({ page: pagination.page, limit: pagination.limit });
  } catch (err) {
    console.error(err);
    const msg =
      err?.response?.data?.message ||
      'Failed to delete developer. Try again.';
    toast.error(msg);
  }
};

  const handleCreateClick = () => {
    // We'll build this page later
    navigate('/developers/new');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4 gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Developer Directory</h1>
            <p className="text-sm text-slate-600">
              Search, filter and explore developers.
            </p>
          </div>

          <button
            onClick={handleCreateClick}
            className="text-sm px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            + Add Developer
          </button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {/* Search */}
          <div className="flex flex-col">
            <label className="text-xs font-medium mb-1 text-slate-700">
              Search (name / tech stack)
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-md px-3 py-1.5 text-sm"
              placeholder="e.g. React, Node, Abhimanyu"
            />
          </div>

          {/* Role filter */}
          <div className="flex flex-col">
            <label className="text-xs font-medium mb-1 text-slate-700">
              Role
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border rounded-md px-3 py-1.5 text-sm bg-white"
            >
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="flex flex-col">
            <label className="text-xs font-medium mb-1 text-slate-700">
              Sort by
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border rounded-md px-3 py-1.5 text-sm bg-white"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-md">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
  <Spinner text="Loading developers..." />
)}


        {/* Empty state */}
        {!loading && developers.length === 0 && !error && (
          <div className="py-10 text-center text-sm text-slate-600">
            No developers found. Try changing search or filters.
          </div>
        )}

        {/* Developer cards */}
        {!loading && developers.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {developers.map((dev) => (
              <div
                key={dev._id}
                className="bg-white border rounded-lg p-4 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-lg font-semibold">{dev.name}</h2>
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-100 border text-slate-700">
                      {dev.role}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mb-1">
                    Experience:{' '}
                    <span className="font-medium">{dev.experience} yrs</span>
                  </p>

                  {dev.description && (
                    <p className="text-xs text-slate-700 mb-2 line-clamp-2">
                      {dev.description}
                    </p>
                  )}

                  {/* Tech stack tags */}
                  {dev.techStack && dev.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {dev.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 text-xs">
                  <Link
                    to={`/developers/${dev._id}`}
                    className="px-3 py-1.5 rounded-md border border-slate-300 hover:bg-slate-100"
                  >
                    View Profile
                  </Link>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/developers/${dev._id}/edit`)}
                      className="px-3 py-1.5 rounded-md border border-slate-300 hover:bg-slate-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(dev._id)}
                      className="px-3 py-1.5 rounded-md border border-red-200 text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && developers.length > 0 && (
          <div className="flex items-center justify-between mt-6 text-xs">
            <div>
              Page {pagination.page} of {pagination.totalPages} · Total{' '}
              {pagination.total} developers
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1.5 rounded-md border border-slate-300 disabled:opacity-50"
              >
                Prev
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1.5 rounded-md border border-slate-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DeveloperListPage;
