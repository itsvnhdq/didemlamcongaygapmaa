import React, { createContext, useContext, useState } from "react";

interface BloodInventory {
  type: string;
  units: number;
  status: string;
}

interface DonationStats {
  totalDonations: number;
  thisMonth: number;
  thisWeek: number;
  today: number;
  emergencyRequests: number;
}

interface RecentActivity {
  id: number;
  type: string;
  description: string;
  user: string;
  time: string;
}

interface StaffContextType {
  bloodInventorySummary: BloodInventory[];
  setBloodInventorySummary: React.Dispatch<
    React.SetStateAction<BloodInventory[]>
  >;
  donationStats: DonationStats;
  setDonationStats: React.Dispatch<React.SetStateAction<DonationStats>>;
  recentActivity: RecentActivity[];
  setRecentActivity: React.Dispatch<React.SetStateAction<RecentActivity[]>>;
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

export const StaffProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [bloodInventorySummary, setBloodInventorySummary] = useState<
    BloodInventory[]
  >([
    { type: "A+", units: 25, status: "adequate" },
    { type: "A-", units: 10, status: "low" },
    { type: "B+", units: 15, status: "adequate" },
    { type: "B-", units: 5, status: "critical" },
    { type: "AB+", units: 8, status: "low" },
    { type: "AB-", units: 3, status: "critical" },
    { type: "O+", units: 30, status: "adequate" },
    { type: "O-", units: 12, status: "low" },
  ]);

  const [donationStats, setDonationStats] = useState<DonationStats>({
    totalDonations: 3245,
    thisMonth: 142,
    thisWeek: 37,
    today: 12,
    emergencyRequests: 3,
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: 1,
      type: "donation",
      description: "New donation completed",
      user: "John Smith",
      time: "15 minutes ago",
    },
    {
      id: 2,
      type: "emergency",
      description: "Emergency request fulfilled",
      user: "City General Hospital",
      time: "45 minutes ago",
    },
    {
      id: 3,
      type: "inventory",
      description: "Blood inventory updated",
      user: "Staff Member: David Wilson",
      time: "2 hours ago",
    },
    {
      id: 4,
      type: "appointment",
      description: "Appointment scheduled",
      user: "Michael Brown",
      time: "3 hours ago",
    },
    {
      id: 5,
      type: "donation",
      description: "Donation request processed",
      user: "Sarah Davis",
      time: "4 hours ago",
    },
  ]);

  return (
    <StaffContext.Provider
      value={{
        bloodInventorySummary,
        setBloodInventorySummary,
        donationStats,
        setDonationStats,
        recentActivity,
        setRecentActivity,
      }}
    >
      {children}
    </StaffContext.Provider>
  );
};

export const useStaffContext = () => {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error("useStaffContext must be used within a StaffProvider");
  }
  return context;
};
