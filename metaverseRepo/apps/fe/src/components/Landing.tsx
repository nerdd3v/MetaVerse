import React from "react";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl mb-4">Landing Page</h1>
      <Link to="/signup">
        <button className="bg-red-500 px-4 py-2 rounded text-white m-2">
          Signup
        </button>
      </Link>
      <Link to="/signin">
        <button className="bg-red-500 px-4 py-2 rounded text-white m-2">
          Signin
        </button>
      </Link>
    </div>
  );
}

export default Landing;