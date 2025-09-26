import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Landing from "./components/Landing";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import UserPage from "./components/UserPage";
import Metadata from "./components/Metadata";
import Arena from "./Game";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Arena />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/main" element={<UserPage/>} />
        <Route path="/metadata" element={<Metadata/>} />
      </Routes>
    </Router>
  );
}

export default App;