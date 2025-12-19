import api from "./axiosInstance";

export interface User {
    id?: string;
    email: string;
    name: string;
    role: string;
    address?: string;
    city?: string;
    postal_code?: string;
    country?: string;
    phone?: string;
}

export interface UserUpdate {
    email: string;
    name: string;
    password?: string;
    role?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    country?: string;
    phone?: string;
}

export const registerUser = async (data: {
    name: string;
    email: string;
    password: string;
    address?: string;
    city?: string;
    postal_code?: string;
    country?: string;
    phone?: string;
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

export const getProfile = async (): Promise<User> => {
    const res = await api.get("/users/me");
    return res.data;
};

export const getAllUsers = async (): Promise<User[]> => {
    const res = await api.get("/users");
    return res.data;
};

export const updateUser = async (userId: string, data: UserUpdate): Promise<User> => {
    const res = await api.put(`/users/${userId}`, data);
    return res.data;
};

export const updateMyProfile = async (data: UserUpdate): Promise<User> => {
    const res = await api.put("/users/me", data);
    return res.data;
};

export const deleteUser = async (userId: string): Promise<void> => {
    await api.delete(`/users/${userId}`);
};
