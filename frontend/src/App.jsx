// src/App.jsx
import { useState } from "react";
import DeveloperForm from "./components/DeveloperForm";
import DeveloperList from "./components/DeveloperList";
import Toast from "./components/Toast";

export default function App() {
  // change trigger to force DeveloperList reload after add
  const [trigger, setTrigger] = useState(Date.now());
  const [toast, setToast] = useState({ msg: "", type: "success" });

  function showToast(msg, type = "success") {
    setToast({ msg, type });
  }

  function onAdded() {
    setTrigger(Date.now());
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Developer Directory</h1>

        <div className="grid gap-6 md:grid-cols-2 grid-cols-1">
          <DeveloperForm onAdded={onAdded} showToast={showToast} />
          <div className="border rounded p-4">
            <h2 className="font-semibold mb-2">Developers</h2>
            <DeveloperList trigger={trigger} />
          </div>
        </div>
      </div>

      <Toast
        message={toast.msg}
        type={toast.type}
        onClose={() => setToast({ msg: "", type: "success" })}
      />
    </div>
  );
}
