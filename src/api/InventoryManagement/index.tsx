import { apiCall } from "../../utils/api";

export interface Facility {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  email?: string;
  latitude: number;
  longitude: number;
  operatingHours: {
    day: string;
    open: string;
    close: string;
  }[];
  status: "ACTIVE" | "INACTIVE" | "TEMPORARILY_CLOSED";
  createdAt: string;
  updatedAt: string;
}

export interface FacilityCreate {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  email?: string;
  latitude: number;
  longitude: number;
  operatingHours: {
    day: string;
    open: string;
    close: string;
  }[];
}

export interface FacilityUpdate {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phoneNumber?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  operatingHours?: {
    day: string;
    open: string;
    close: string;
  }[];
  status?: "ACTIVE" | "INACTIVE" | "TEMPORARILY_CLOSED";
}

export interface BloodInventory {
  facilityId: string;
  bloodType: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  quantity: number;
  lastUpdated: string;
  expiryDate?: string;
  status: "AVAILABLE" | "LOW" | "CRITICAL" | "EXPIRED";
}

export interface LocationQuery {
  latitude: number;
  longitude: number;
  radius?: number; // in kilometers
}

// Create new facility (admin only)
export const createFacility = async (
  facility: FacilityCreate
): Promise<Facility> => {
  return await apiCall.post<Facility>("/api/facilities/", facility);
};

// Get all facilities
export const getAllFacilities = async (): Promise<Facility[]> => {
  return await apiCall.get<Facility[]>("/api/facilities/");
};

// Get facility by ID
export const getFacilityById = async (id: string): Promise<Facility> => {
  return await apiCall.get<Facility>(`/api/facilities/${id}/`);
};

// Update facility (admin/staff)
export const updateFacility = async (
  id: string,
  facilityData: FacilityUpdate
): Promise<Facility> => {
  return await apiCall.put<Facility>(`/api/facilities/${id}/`, facilityData);
};

// Delete facility (admin only)
export const deleteFacility = async (id: string): Promise<void> => {
  return await apiCall.delete(`/api/facilities/${id}/`);
};

// Get facilities by location
export const getNearbyFacilities = async (
  location: LocationQuery
): Promise<Facility[]> => {
  const params = new URLSearchParams(location as any).toString();
  return await apiCall.get<Facility[]>(`/api/facilities/nearby/?${params}`);
};

// Get blood inventory
export const getFacilityInventory = async (
  id: string
): Promise<BloodInventory[]> => {
  return await apiCall.get<BloodInventory[]>(`/api/facilities/${id}/inventory/`);
};

// Update blood inventory
export const updateFacilityInventory = async (
  id: string,
  inventory: BloodInventory[]
): Promise<BloodInventory[]> => {
  return await apiCall.put<BloodInventory[]>(`/api/facilities/${id}/inventory/`, inventory);
};
