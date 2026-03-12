import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const theme = createTheme({
    palette: {
        primary: {
            main: '#e31e24', // AMCSSSPL Primary Red
        },
        secondary: {
            main: '#2a2a2a', // AMCSSSPL Secondary Dark
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
});

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    if (!user) {
        return <Navigate to="/" />;
    }
    return children;
};

const MainLayout = ({ children }) => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/';

    return (
        <div className="app-viewport" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8f9fa' }}>
            {!isLoginPage && <Header />}
            <div className="page-wrapper" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {children}
            </div>
            {!isLoginPage && <Footer />}
        </div>
    );
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <Router>
                    <MainLayout>
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
                    </MainLayout>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
