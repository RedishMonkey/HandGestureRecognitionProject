import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./components/Home.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { Profile } from "./components/Profile.jsx";
import { Loader } from "./components/Loader.jsx";
import { ConnectToRobot } from "./components/ConnectToRobot.jsx";

import { useAuth } from "./components/AuthProvider.jsx";

import "./App.css";

function App() {
  const { isPending } = useAuth();
  
  if (isPending) return <Loader />

  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/connect-to-robot" element={<ConnectToRobot />} />
        </Routes>
      </div>
      
    </>
  );
}

export default App;
