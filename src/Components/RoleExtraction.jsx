import { jwtDecode } from "jwt-decode";

export const getRoleFromToken = () => {
  const token = localStorage.getItem("access_token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded?.Role || null;
  } catch {
    return null;
  }
};