// src/components/DeveloperForm.jsx
import { useState } from "react";
import toast from 'react-hot-toast';




const ROLES = ["Frontend", "Backend", "Full-Stack","Data Analyst" ,"Devops"];

export default function DeveloperForm({ onAdded, showToast }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState(ROLES[0]);
  const [techStack, setTechStack] = useState("");
  const [experience, setExperience] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    const errs = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!ROLES.includes(role)) errs.role = "Role is invalid";
    if (!techStack.trim()) errs.techStack = "Tech stack is required";
    if (experience === "" || isNaN(Number(experience))) errs.experience = "Experience must be a number";
    else if (Number(experience) < 0) errs.experience = "Experience cannot be negative";
    return errs;
  }

const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);
  setErrors('');

  const payload = {
    ...form,
    experience: Number(form.experience)
  };

  try {
    if (isEdit) {
      await updateDeveloper(id, payload);
      toast.success('Developer updated successfully');
    } else {
      await createDeveloper(payload);
      toast.success('Developer created successfully');
    }

    navigate('/developers');
  } catch (err) {
    console.error(err);
    const msg =
      err?.response?.data?.message ||
      `Failed to ${isEdit ? 'update' : 'create'} developer.`;
    setError(msg);
    toast.error(msg);
  } finally {
    setSaving(false);
  }
};


  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-white">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`mt-1 w-full border px-3 py-2 rounded ${errors.name ? "border-red-500" : ""}`}
          placeholder="Full name"
        />
        {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={`mt-1 w-full border px-3 py-2 rounded ${errors.role ? "border-red-500" : ""}`}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        {errors.role && <p className="text-xs text-red-600 mt-1">{errors.role}</p>}
      </div>

      {/* Tech Stack */}
      <div>
        <label className="block text-sm font-medium">Tech Stack (comma-separated)</label>
        <input
          value={techStack}
          onChange={(e) => setTechStack(e.target.value)}
          className={`mt-1 w-full border px-3 py-2 rounded ${errors.techStack ? "border-red-500" : ""}`}
          placeholder="React, Node.js, MongoDB"
        />
        {errors.techStack && <p className="text-xs text-red-600 mt-1">{errors.techStack}</p>}
      </div>

      {/* Experience */}
      <div>
        <label className="block text-sm font-medium">Experience (years)</label>
        <input
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          type="number"
          step="0.1"
          min="0"
          className={`mt-1 w-full border px-3 py-2 rounded ${errors.experience ? "border-red-500" : ""}`}
          placeholder="e.g., 1.5"
        />
        {errors.experience && <p className="text-xs text-red-600 mt-1">{errors.experience}</p>}
      </div>

      {/* Submit */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded text-white ${isSubmitting ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {isSubmitting ? "Saving..." : "Add Developer"}
        </button>
      </div>
    </form>
  );
}
