// src/components/DeveloperList.jsx
import { useEffect, useState, useRef } from "react";

export default function DeveloperList({ trigger }) {
  const [list, setList] = useState([]);
  const [filterRole, setFilterRole] = useState("");
  const [filterTech, setFilterTech] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debounceRef = useRef(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/developers`);
      const data = await res.json();
      setList(Array.isArray(data) ? data.reverse() : []);
    } catch (err) {
      console.error("Failed to load", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [trigger]);

  // debounce searchTerm -> filterTech
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilterTech(searchTerm);
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [searchTerm]);

  const visible = list.filter((dev) => {
    if (filterRole && dev.role !== filterRole) return false;
    if (filterTech) {
      const tok = filterTech.toLowerCase().trim();
      if (!tok) return true;
      return dev.techStack.some((t) => t.toLowerCase().includes(tok));
    }
    return true;
  });

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All roles</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="Full-Stack">Full-Stack</option>
        </select>

        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tech (e.g., react)"
          className="border px-3 py-2 rounded flex-1"
        />

        <button onClick={() => { setFilterRole(""); setSearchTerm(""); setFilterTech(""); }} className="px-3 py-2 border rounded">
          Clear
        </button>

        <button onClick={load} className="px-3 py-2 border rounded">
          Refresh
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : visible.length === 0 ? (
        <div className="text-sm text-gray-600">No developers found.</div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {visible.map((dev) => (
            <li key={dev.id} className="border rounded p-3 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{dev.name}</h3>
                <span className="text-sm text-gray-500">{dev.role}</span>
              </div>
              <p className="text-sm mt-2">Experience: {dev.experience} yrs</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {dev.techStack.map((t, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-gray-100 rounded">
                    {t}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
