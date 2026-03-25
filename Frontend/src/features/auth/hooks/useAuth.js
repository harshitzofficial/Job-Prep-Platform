import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";



export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context


    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await login({ email, password });
            // Critical: Update the user state with the NEW data from the server
            setUser(data.user);
            return true; // Return true so Login.jsx knows it succeeded
        } catch (err) {
            console.error("Login Error:", err);
            return false; // Return false so we don't redirect on failure
        } finally {
            setLoading(false);
        }
    };
    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const data = await register({ username, email, password });
            setUser(data.user);
            return { success: true }; 
        } catch (err) {
            // Capture the error message from the backend
            const errorMsg = err.response?.data?.message || "Registration failed";
            return { success: false, message: errorMsg };
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true)
        try {
            const data = await logout()
            setUser(null)
        } catch (err) {

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {

        const getAndSetUser = async () => {
            try {

                const data = await getMe()
                setUser(data.user)
            } catch (err) { } finally {
                setLoading(false)
            }
        }

        getAndSetUser()

    }, [])

    return { user, loading, handleRegister, handleLogin, handleLogout }
}