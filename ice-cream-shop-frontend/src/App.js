import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import './App.css'; // Import the CSS file

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/user-dashboard" element={<UserDashboard />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/" element={<Login />} />
                    {/* Fallback route for undefined paths */}
                    <Route path="*" element={<Login />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
