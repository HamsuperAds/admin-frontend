export interface User {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  email_verified_at: string | null;
  phone_number: string | null;
  phone_number_verified_at: string | null;
  gender: string | null;
  country: string | null;
  state: string | null;
  lga: string | null;
  town: string | null;
  date_of_birth: string | null;
  verified: boolean;
  avatar: string | null;
  device_token: string | null;
  notification_pref: string | null;
  status: "active" | "inactive" | "suspended";
  adsCount?: number;
  created_at: string;
  updated_at: string;
}
