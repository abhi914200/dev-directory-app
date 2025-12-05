// src/components/DeveloperList.jsx
import { useEffect, useState, useRef } from "react";
import DeveloperEdit from "./DeveloperEdit";




export default function DeveloperList({ trigger, showToast }) {
  const [list, setList] = useState([]);
  const [filterRole, setFilterRole] = useState("");
  const [filterTech, setFilterTech] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debounceRef = useRef(null);
  const [editingId, setEditingId] = useState(null);
const [editingMap, setEditingMap] = useState({}); // optional: store temp updated devs


  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/developers`);
      const data = await res.json();
      setList(Array.isArray(data) ? data.reverse() : []);
    } catch (err) {
      console.error("Failed to load", err);
      showToast && showToast("Failed to load developers", "error");
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
    function startEdit(dev) {
    setEditingId(dev._id ?? dev.id);
    // optional local cache of original data if needed
    setEditingMap((m) => ({ ...m, [dev._id ?? dev.id]: dev }));
  }

  function cancelEdit() {
    setEditingId(null);
  }

  // called when DeveloperEdit's onSaved finishes
  function handleSaved(updatedDeveloper) {
    // update list in-place (prefer by _id)
    setList((prev) =>
      prev.map((it) => ( (it._id ?? it.id) === (updatedDeveloper._id ?? updatedDeveloper.id) ? updatedDeveloper : it ))
    );
    setEditingId(null);
  }

    // Delete handler
  async function handleDelete(id) {
    const confirmed = confirm("Are you sure you want to delete this developer?");
    if (!confirmed) return;

    // optimistic UI update
    const prev = list;
    setList(prev.filter((d) => d._id !== id && d.id !== id));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/developers/${id}`, {
        method: "DELETE",
      });
      const body = await res.json();
      if (!res.ok) {
        // revert on error
        setList(prev);
        const msg = body?.error || "Failed to delete";
        showToast && showToast(msg, "error");
        return;
      }
      showToast && showToast("Developer deleted", "success");
    } catch (err) {
      console.error("Delete error", err);
      setList(prev); // revert
      showToast && showToast("Network error", "error");
    }
  }


  return (
    <div className="p-4 bg-slate-50">
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All roles</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="Full-Stack">Full-Stack</option>
          <option value="Data Analyst">Data Analyst</option>
          <option value="DevOps">DevOps</option>
        </select>

        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tech (e.g., react)"
          className="border px-3 py-2 rounded flex-1"
        />

      <button
       onClick={() => {
       setFilterRole("");
       setSearchTerm("");
       setFilterTech("");
      }}
      className="px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
      >
      Clear
      </button>

    <button
       onClick={load}
       className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
    >
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
            <li key={dev._id ?? dev.id} className="border rounded p-3 bg-white">
  <div className="flex items-center justify-between">
    <h3 className="font-semibold">{dev.name}</h3>
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">{dev.role}</span>

      <button
        onClick={() => startEdit(dev)}
        className="text-xs px-2 py-1 border rounded bg-yellow-50 text-yellow-800 hover:bg-yellow-100"
        title="Edit developer"
      >
        Edit
      </button>

      <button
        onClick={() => handleDelete(dev._id ?? dev.id)}
        className="text-xs px-2 py-1 border rounded bg-red-50 text-red-700 hover:bg-red-100"
        title="Delete developer"
      >
        Delete
      </button>
    </div>
  </div>

  <p className="text-sm mt-2">Experience: {dev.experience} yrs</p>
  <div className="mt-2 flex flex-wrap gap-2">
    {dev.techStack.map((t, i) => (
      <span key={i} className="text-xs px-2 py-1 bg-gray-100 rounded">
        {t}
      </span>
    ))}
  </div>

  {/* show edit form when this item is editing */}
  { (editingId === (dev._id ?? dev.id)) && (
    <DeveloperEdit
      dev={dev}
      onCancel={cancelEdit}
      onSaved={handleSaved}
      showToast={showToast}
    />
  )}
</li>

          ))}
        </ul>
      )}
    </div>
  );
}
