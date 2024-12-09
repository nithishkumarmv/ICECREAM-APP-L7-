import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/Login.css';  // Importing the CSS for login styling

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                username,
                password,
            });

            if (username === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/user-dashboard');
            }
        } catch (error) {
            setErrorMessage('Invalid credentials');
        }
    };

    return (
        <div>
        <h2>ICE CREAM PARLOR CAFE</h2>
        <div className="login-container">
            <h2 className="login-title">Login</h2>
            <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                    <label htmlFor="username" className="form-label">Username:</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password" className="form-label">Password:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                    />
                </div>
                <button type="submit" className="submit-button">Login</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </form>
        </div>
        </div>
    );
};

export default Login;
