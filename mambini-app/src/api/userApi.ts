import api from "./axiosInstance";

export const registerUser = async (data: {
    name: string;
    email: string;
    password: string;
}) => {
    const res = await api.post("/users/register", data);
    return res.data;
};

export const loginUser = async (data: {
    email: string;
    password: string;
}) => {
    const res = await api.post("/users/login", data);
    return res.data;
};

export const getProfile = async (token: string) => {
    const res = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};
