import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    if (!user) {
        return <Navigate to="/" />;
    }
    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app-viewport" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Header />
                    <div className="page-wrapper" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Routes>
                            <Route path="/" element={<Login />} />
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
