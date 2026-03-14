import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from './Navbar';
import { toast } from 'react-toastify';
import { useMemo, useEffect } from 'react';

const ProtectedRouter = ({ children, allowedRoles }) => {
  const location = useLocation();
  const token = localStorage.getItem("access_token");

  const userRole = useMemo(() => {
    try {
      const decoded = jwtDecode(token);
      return decoded.Role || null;
    } catch {
      return null;
    }
  }, [token]);

  useEffect(() => {
    if (userRole && !allowedRoles.includes(userRole)) {
      toast.error(`This user is not allowed: ${userRole}`);
    }
  }, [userRole, allowedRoles]);

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  const main_style = {
    width:"calc(100%-5rem)",
    marginLeft: "5rem",
    overflowX: "hidden"
  }

  return (
    <>
      <div>
        <Navbar userRole={userRole} />
        <div style={main_style}>
          {children}
        </div>
      </div>
    </>
  );
};

export default ProtectedRouter;