// Temporary frontend-only authentication. Replace with server-side authentication when backend is introduced.

const SESSION_KEY = "as_collection_admin_session";

/** @type {{ username: string; password: string }} Replace with backend auth API call. */
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "ascollection",
};

/**
 * Attempt admin login. On success, stores a session flag only — never the password.
 * @returns {{ success: true } | { success: false; error: string }}
 */
export function loginAdmin(username, password) {
  const normalizedUsername = (username ?? "").trim();
  const normalizedPassword = password ?? "";

  if (
    normalizedUsername === ADMIN_CREDENTIALS.username &&
    normalizedPassword === ADMIN_CREDENTIALS.password
  ) {
    sessionStorage.setItem(SESSION_KEY, "authenticated");
    return { success: true };
  }

  return { success: false, error: "Invalid username or password." };
}

/** @returns {boolean} Whether the current browser session is authenticated. */
export function isAdminAuthenticated() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_KEY) === "authenticated";
}

/** Clears the admin session flag. Does not touch other localStorage data. */
export function logoutAdmin() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}
