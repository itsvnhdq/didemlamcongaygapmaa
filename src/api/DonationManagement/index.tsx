import { apiCall } from "../../utils/api";

export interface Donation {
  id: string;
  donorId: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
  description?: string;
  paymentMethod: string;
  transactionId?: string;
}

export interface DonationCreate {
  donorId: string;
  amount: number;
  description?: string;
  paymentMethod: string;
}

export interface DonationUpdate {
  status?: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  description?: string;
  transactionId?: string;
}

export interface DonationStats {
  totalDonations: number;
  totalAmount: number;
  averageAmount: number;
  donationsByStatus: {
    PENDING: number;
    APPROVED: number;
    REJECTED: number;
    COMPLETED: number;
  };
  recentDonations: Donation[];
  topDonors: {
    donorId: string;
    totalAmount: number;
    donationCount: number;
  }[];
}

// Create new donation record
export const createDonation = async (
  donation: DonationCreate
): Promise<Donation> => {
  return await apiCall.post<Donation>(`/api/donations/`, donation);
};

// Get all donations with optional filters
export const getAllDonations = async (filters?: {
  status?: string;
  startDate?: string;
  endDate?: string;
  donorId?: string;
}): Promise<Donation[]> => {
  const params = filters ? `?${new URLSearchParams(filters).toString()}` : '';
  return await apiCall.get<Donation[]>(`/api/donations/${params}`);
};

// Get donation by ID
export const getDonationById = async (id: string): Promise<Donation> => {
  return await apiCall.get<Donation>(`/api/donations/${id}/`);
};

// Update donation record (staff/admin only)
export const updateDonation = async (
  id: string,
  donation: DonationUpdate
): Promise<Donation> => {
  return await apiCall.put<Donation>(`/api/donations/${id}/`, donation);
};

// Delete donation record (admin only)
export const deleteDonation = async (id: string): Promise<void> => {
  return await apiCall.delete(`/api/donations/${id}/`);
};

// Get donation statistics
export const getDonationStats = async (): Promise<DonationStats> => {
  return await apiCall.get<DonationStats>(`/api/donations/stats/`);
};
