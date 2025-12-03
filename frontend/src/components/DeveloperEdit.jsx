// src/components/DeveloperEdit.jsx
import { useState } from "react";

export default function DeveloperEdit({ dev, onCancel, onSaved, showToast }) {
  const [name, setName] = useState(dev.name || "");
  const [role, setRole] = useState(dev.role || "Frontend");
  const [techStack, setTechStack] = useState((dev.techStack || []).join(", "));
  const [experience, setExperience] = useState(String(dev.experience ?? ""));
  const [isSaving, setIsSaving] = useState(false);

  const ROLES = ["Frontend", "Backend", "Full-Stack"];

  async function handleSave(e) {
    e.preventDefault();
    // basic client-side validation
    if (!name.trim()) return showToast?.("Name is required", "error");
    if (!techStack.trim()) return showToast?.("Tech stack is required", "error");
    if (experience === "" || isNaN(Number(experience))) return showToast?.("Experience must be a number", "error");

    setIsSaving(true);
    try {
      const payload = {
        name: name.trim(),
        role,
        techStack: techStack,
        experience: Number(experience)
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/developers/${dev._id ?? dev.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await res.json();
      if (!res.ok) {
        const msg = body?.errors?.join?.(", ") || body?.error || "Failed to update";
        showToast?.(msg, "error");
        setIsSaving(false);
        return;
      }

      showToast?.("Developer updated", "success");
      onSaved && onSaved(body.developer || body); // caller will refresh or update list
    } catch (err) {
      console.error("Edit save error", err);
      showToast?.("Network error", "error");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="mt-3 border-t pt-3">
      <div className="grid gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-2 py-1 rounded"
          placeholder="Name"
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full border px-2 py-1 rounded">
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <input
          value={techStack}
          onChange={(e) => setTechStack(e.target.value)}
          className="w-full border px-2 py-1 rounded"
          placeholder="React, Node.js, MongoDB"
        />
        <input
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          type="number"
          step="0.1"
          min="0"
          className="w-full border px-2 py-1 rounded"
          placeholder="Experience (years)"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSaving}
            className={`px-3 py-1 rounded text-white ${isSaving ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 rounded border"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
