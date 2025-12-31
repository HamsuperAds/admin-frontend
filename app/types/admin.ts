export interface Admin {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  email: string;
  email_verified_at: string | null;
  phone_number: string;
  gender: string;
  avatar: string;
  status: "active" | "inactive" | "suspended";
  last_login_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
