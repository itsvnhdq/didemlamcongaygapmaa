import { apiCall } from "../../utils/api";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "STAFF" | "DONOR";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  createdAt: string;
  updatedAt: string;
  phoneNumber?: string;
  address?: string;
  citizenId: string;
  password: string;
  dateOfBirth: string;
  emergencyContact: string;
  medicalConditions: string;
  lastActive: string;
}

export interface UserUpdate {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}

export interface UserWithDonations extends User {
  donations: {
    id: string;
    amount: number;
    status: string;
    createdAt: string;
  }[];
}

export interface UserWithAppointments extends User {
  appointments: {
    id: string;
    date: string;
    status: string;
    type: string;
  }[];
}

// Get all users (admin only)
export const getAllUsers = async (): Promise<User[]> => {
  return await apiCall.get<User[]>("/api/users/");
};

// Get user by ID
export const getUserById = async (id: string): Promise<User> => {
  return await apiCall.get<User>(`/api/users/${id}/`);
};

// Update user (admin or self)
export const updateUser = async (
  id: string,
  userData: UserUpdate
): Promise<User> => {
  return await apiCall.put<User>(`/api/users/${id}/`, userData);
};

// Delete user (admin only)
export const deleteUser = async (id: string): Promise<void> => {
  return await apiCall.delete(`/api/users/${id}/`);
};

// Get user's donation history
export const getUserDonations = async (
  id: string
): Promise<UserWithDonations> => {
  return await apiCall.get<UserWithDonations>(`/api/users/${id}/donations/`);
};

// Get user's appointments
export const getUserAppointments = async (
  id: string
): Promise<UserWithAppointments> => {
  return await apiCall.get<UserWithAppointments>(`/api/users/${id}/appointments/`);
};

// Change user role (admin only)
export const changeUserRole = async (
  id: string,
  role: "ADMIN" | "STAFF" | "DONOR"
): Promise<User> => {
  return await apiCall.post<User>(`/api/users/${id}/role/`, { role });
};

// Create new user (admin only)
export const createUser = async (userData: {
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "STAFF" | "DONOR";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  phoneNumber: string;
  address: string;
  citizenId: string;
  password: string;
  dateOfBirth: string;
  emergencyContact: string;
  medicalConditions: string;
}): Promise<User> => {
  return await apiCall.post<User>("/api/users/", {
    email: userData.email,
    first_name: userData.firstName,
    last_name: userData.lastName,
    role: userData.role,
    status: userData.status,
    phone_number: userData.phoneNumber,
    address: userData.address,
    citizen_id: userData.citizenId,
    password: userData.password,
    date_of_birth: userData.dateOfBirth,
    emergency_contact: userData.emergencyContact,
    medical_conditions: userData.medicalConditions
  });
};
