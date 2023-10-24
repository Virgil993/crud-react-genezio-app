import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./views/Dashboard";
import AddUser from "./views/AddUser";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/addUser" element={<AddUser />}></Route>
          <Route path="*" element={<Navigate to="/dashboard" />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
