import baseApi from "./baseApi";
import { IUser, role } from "@/types/types";

export interface User { 
    userId: number
    username: string
    full_name: string    
    avatar?: string
    role: string
    createdAt: string
    updatedAt?: string
}
export enum Role {
    ADMIN = "admin",
    USER = "user"
    
}

// Point to an existing asset in public/ to avoid 404
const DEFAULT_AVATAR = "/next.svg";

export const mapUserToIUser = (u: User): IUser => ({
    user_id: u.userId,
    username: u.username,
    password: undefined,
    full_name: u.full_name,
    role: u.role?.toLowerCase() === role.ADMIN ? role.ADMIN : role.USER,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt || u.createdAt,
    avatar: u.avatar || DEFAULT_AVATAR,
});

export const getAllUsers = async (): Promise<IUser[]> => {
    try {
        const { data } = await baseApi.get<User[]>("/User");
        return (data || []).map(mapUserToIUser);
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}


