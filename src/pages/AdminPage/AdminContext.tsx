import React, { createContext, useContext, useState } from "react";

interface BloodInventory {
  type: string;
  units: number;
  status: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "member" | "staff" | "admin";
  status: "active" | "inactive";
  lastActive: string;
}

interface UserSummary {
  total: number;
  members: number;
  staff: number;
  admins: number;
  newThisMonth: number;
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

interface AdminContextType {
  bloodInventorySummary: BloodInventory[];
  setBloodInventorySummary: React.Dispatch<
    React.SetStateAction<BloodInventory[]>
  >;
  userSummary: UserSummary;
  setUserSummary: React.Dispatch<React.SetStateAction<UserSummary>>;
  donationStats: DonationStats;
  setDonationStats: React.Dispatch<React.SetStateAction<DonationStats>>;
  recentActivity: RecentActivity[];
  setRecentActivity: React.Dispatch<React.SetStateAction<RecentActivity[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  addUser: (user: User) => void;
  editUser: (user: User) => void;
  deleteUser: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({
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

  const [userSummary, setUserSummary] = useState<UserSummary>({
    total: 1250,
    members: 1120,
    staff: 25,
    admins: 5,
    newThisMonth: 48,
  });

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
      type: "user",
      description: "New member registered",
      user: "Emily Johnson",
      time: "1 hour ago",
    },
    {
      id: 4,
      type: "inventory",
      description: "Blood inventory updated",
      user: "Staff Member: David Wilson",
      time: "2 hours ago",
    },
    {
      id: 5,
      type: "appointment",
      description: "Appointment scheduled",
      user: "Michael Brown",
      time: "3 hours ago",
    },
  ]);

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@example.com",
      role: "member",
      status: "active",
      lastActive: "2025-05-20T10:00:00Z",
    },
    {
      id: "2",
      name: "Jane Doe",
      email: "jane.doe@example.com",
      role: "admin",
      status: "active",
      lastActive: "2025-05-19T15:30:00Z",
    },
    {
      id: "3",
      name: "Emily Johnson",
      email: "emily.johnson@example.com",
      role: "staff",
      status: "active",
      lastActive: "2025-05-18T09:00:00Z",
    },
    {
      id: "4",
      name: "David Wilson",
      email: "david.wilson@example.com",
      role: "staff",
      status: "inactive",
      lastActive: "2025-05-15T12:00:00Z",
    },
  ]);

  const addUser = (user: User) => {
    setUsers([...users, user]);
    setUserSummary((prev) => ({
      ...prev,
      total: prev.total + 1,
      members: user.role === "member" ? prev.members + 1 : prev.members,
      staff: user.role === "staff" ? prev.staff + 1 : prev.staff,
      admins: user.role === "admin" ? prev.admins + 1 : prev.admins,
      newThisMonth: prev.newThisMonth + 1,
    }));
  };

  const editUser = (updatedUser: User) => {
    const oldUser = users.find((u) => u.id === updatedUser.id);
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    if (oldUser && oldUser.role !== updatedUser.role) {
      setUserSummary((prev) => ({
        ...prev,
        members:
          (oldUser.role === "member" ? prev.members - 1 : prev.members) +
          (updatedUser.role === "member" ? 1 : 0),
        staff:
          (oldUser.role === "staff" ? prev.staff - 1 : prev.staff) +
          (updatedUser.role === "staff" ? 1 : 0),
        admins:
          (oldUser.role === "admin" ? prev.admins - 1 : prev.admins) +
          (updatedUser.role === "admin" ? 1 : 0),
      }));
    }
  };

  const deleteUser = (id: string) => {
    const user = users.find((u) => u.id === id);
    setUsers(users.filter((u) => u.id !== id));
    if (user) {
      setUserSummary((prev) => ({
        ...prev,
        total: prev.total - 1,
        members: user.role === "member" ? prev.members - 1 : prev.members,
        staff: user.role === "staff" ? prev.staff - 1 : prev.staff,
        admins: user.role === "admin" ? prev.admins - 1 : prev.admins,
      }));
    }
  };

  return (
    <AdminContext.Provider
      value={{
        bloodInventorySummary,
        setBloodInventorySummary,
        userSummary,
        setUserSummary,
        donationStats,
        setDonationStats,
        recentActivity,
        setRecentActivity,
        users,
        setUsers,
        addUser,
        editUser,
        deleteUser,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminContext must be used within an AdminProvider");
  }
  return context;
};
