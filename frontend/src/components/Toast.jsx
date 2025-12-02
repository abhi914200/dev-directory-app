import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;

  const base = "fixed right-4 top-4 z-50 px-4 py-2 rounded shadow";
  const style =
    type === "error"
      ? `${base} bg-red-600 text-white`
      : `${base} bg-green-600 text-white`;

  return <div className={style}>{message}</div>;
}
