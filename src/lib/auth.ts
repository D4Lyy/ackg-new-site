import { hashPassword } from "./utils";

const ADMIN_KEY = "ackg_admin";
const SESSION_KEY = "ackg_session";

interface AdminCredentials {
  username: string;
  password: string;
}

export const initializeAdmin = async () => {
  const stored = localStorage.getItem(ADMIN_KEY);
  if (!stored) {
    // Default credentials (should be changed on first login)
    const defaultUsername = await hashPassword("admin");
    const defaultPassword = await hashPassword("admin123");
    localStorage.setItem(
      ADMIN_KEY,
      JSON.stringify({ username: defaultUsername, password: defaultPassword })
    );
  }
};

export const login = async (username: string, password: string): Promise<boolean> => {
  const stored = localStorage.getItem(ADMIN_KEY);
  if (!stored) return false;

  try {
    const credentials: AdminCredentials = JSON.parse(stored);
    const hashedUsername = await hashPassword(username);
    const hashedPassword = await hashPassword(password);

    if (
      hashedUsername === credentials.username &&
      hashedPassword === credentials.password
    ) {
      localStorage.setItem(SESSION_KEY, "true");
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem(SESSION_KEY) === "true";
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string
): Promise<boolean> => {
  const stored = localStorage.getItem(ADMIN_KEY);
  if (!stored) return false;

  try {
    const credentials: AdminCredentials = JSON.parse(stored);
    const hashedOld = await hashPassword(oldPassword);

    if (hashedOld !== credentials.password) return false;

    const hashedNew = await hashPassword(newPassword);
    localStorage.setItem(
      ADMIN_KEY,
      JSON.stringify({ ...credentials, password: hashedNew })
    );
    return true;
  } catch {
    return false;
  }
};
