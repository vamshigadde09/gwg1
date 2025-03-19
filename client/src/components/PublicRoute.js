import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const PublicRoute = ({ children }) => {
  const [role, setRole] = useState(null);
  const [authorized, setAuthorized] = useState(false); // Added missing state
  const [loading, setLoading] = useState(true); // Added missing state

  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.post(
          "http://localhost:8080/api/v1/user/getUserData",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          setAuthorized(true);
          setRole(res.data.data.role);
        } else {
          setAuthorized(false);
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Error in PublicRoute:", error);
        setAuthorized(false);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token]);

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator
  }

  if (authorized && role === "Student") {
    return <Navigate to="/StudentPortal" replace />;
  }

  if (authorized && role === "Teacher") {
    return <Navigate to="/TeacherPortal" replace />;
  }

  return children;
};

export default PublicRoute;
