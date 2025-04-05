import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./components/Home.jsx";
import { Navbar } from "./components/Navbar.jsx";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
