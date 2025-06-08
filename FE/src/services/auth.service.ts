import type { LoginType } from "../types/login.type";
import axiosInstance from "../utils/hook/axiosInstance";

const getSignature = async (address: string) => {
    try {
        const response = await axiosInstance.get('/api/auth/getSignature', {
            params: { address },
            withCredentials: true
        });

        return response.data;
    } catch (error) {
        console.error("Error getting signature:", error);
        throw new Error("Failed to get signature");
    }
}

const login = async (loginType: LoginType) => {
    try { 
        const response = await axiosInstance.post('/api/auth/login', loginType, {
            withCredentials: true
        });

        return response.data;
    } catch (error) {
        console.error("Error during login:", error);
    }
}
export { getSignature, login };