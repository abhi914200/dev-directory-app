// --- Validation helper (server-side) ---
function validateDeveloperPayload(payload) {
  const errors = [];
  if (!payload.name || typeof payload.name !== "string" || !payload.name.trim()) {
    errors.push("name is required");
  }
  const validRoles = ["Frontend", "Backend", "Full-Stack","Data Analyst" ,"Devops"];
  if (!payload.role || !validRoles.includes(payload.role)) {
    errors.push(`role is required and must be one of: ${validRoles.join(", ")}`);
  }
  if (!payload.techStack || (typeof payload.techStack !== "string" && !Array.isArray(payload.techStack))) {
    errors.push("techStack is required (string or array)");  }
  if (payload.experience === undefined || payload.experience === null || isNaN(Number(payload.experience))) {
    errors.push("experience is required and must be a number");
  } else if (Number(payload.experience) < 0) {
    errors.push("experience must be 0 or greater");
  }
  return errors;
}

export { validateDeveloperPayload };