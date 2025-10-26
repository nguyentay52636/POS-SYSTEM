import baseApi from "./baseApi";
import { IUser, role } from "@/types/types";

export interface User {
  userId: number;
  username: string;
  full_name: string;
  avatar?: string;
  role: string | number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  fullName: string;
  role: string | number;
  avatar?: string;
}
export enum Role {
  ADMIN = "admin",
  USER = "user",
}

// Point to an existing asset in public/ to avoid 404
const DEFAULT_AVATAR = "/next.svg";

export const mapUserToIUser = (u: User): IUser => ({
  user_id: u.userId,
  username: u.username,
  password: undefined,
  full_name: u.full_name,
  role: getRoleDisplay(u.role),
  createdAt: u.createdAt,
  updatedAt: u.updatedAt || u.createdAt,
  avatar: u.avatar || DEFAULT_AVATAR,
});

// Helper function to convert role from DB to display format
// Standard mapping: 1 = admin, 2 = staff
const getRoleDisplay = (userRole: string | number): role => {
  const roleValue = typeof userRole === "string" ? userRole : String(userRole);

  // Check if it's numeric or string
  if (roleValue === "1" || roleValue === "admin") {
    return role.ADMIN; // DB role 1 → Display "admin"
  }
  if (roleValue === "2" || roleValue === "staff") {
    return role.STAFF; // DB role 2 → Display "staff"
  }
  return role.USER; // Default to user for customers
};

// Helper function to convert UI role to API format
// UI: value="1" (Admin), value="2" (Staff)
// Backend expects: "admin" or "staff" as strings
const convertRoleForAPI = (uiRole: string | number): string => {
  const roleValue = typeof uiRole === "string" ? uiRole : String(uiRole);

  console.log(
    "Converting role for API, uiRole:",
    uiRole,
    "roleValue:",
    roleValue
  );

  // Based on testing: Backend stores roles REVERSED
  // UI value="1" (Admin) → Backend stores as "staff"
  // UI value="2" (Staff) → Backend stores as "admin"
  if (roleValue === "1") {
    console.log("Converting 1 (Admin) to staff string for backend");
    return "staff"; // UI Admin (1) → Send "staff" to backend → Backend stores as role 1
  } else {
    console.log("Converting 2 (Staff) to admin string for backend");
    return "admin"; // UI Staff (2) → Send "admin" to backend → Backend stores as role 2
  }
};

export const getAllUsers = async (): Promise<IUser[]> => {
  try {
    const { data } = await baseApi.get<User[]>("/User");
    return (data || []).map(mapUserToIUser);
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const createUser = async (
  userData: CreateUserRequest
): Promise<IUser> => {
  try {
    // Convert role to API format before sending
    // Try both fullName and full_name to see which works
    const apiData: any = {
      username: userData.username,
      password: userData.password,
      role: convertRoleForAPI(userData.role),
    };

    // Add both field names to see which backend expects
    if (userData.fullName) {
      apiData.fullName = userData.fullName;
      apiData.full_name = userData.fullName;
    }

    console.log("Creating user with data:", apiData);

    const { data } = await baseApi.post<User>("/User", apiData);
    console.log("User created successfully:", data);
    return mapUserToIUser(data);
  } catch (error: any) {
    console.error("Error creating user:", error);
    console.error("Response data:", error?.response?.data);
    console.error("Request data:", error?.config?.data);
    throw error;
  }
};
