import React from "react";
import { Navigate } from "react-router-dom";
function Protected({ isSignedIn, children }) {
  if (!isSignedIn) {
    return <Navigate to="/user/login" replace />;
  }
  return children;
}
export default Protected;
