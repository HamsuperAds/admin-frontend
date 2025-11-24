export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  location?: string;
  isVerified: boolean;
  role: "user" | "admin" | "moderator";
}
