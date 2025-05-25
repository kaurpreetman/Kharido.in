import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProtectedRoute = ({ isAllowed, children }) => {
  useEffect(() => {
    if (!isAllowed) {
      toast.info("Please login to access this page");
    }
  }, [isAllowed]);

  if (!isAllowed) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
