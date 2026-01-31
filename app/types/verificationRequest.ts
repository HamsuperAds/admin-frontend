export type VerificationStatus =
  | "pending"
  | "under_review"
  | "approved"
  | "rejected"
  | "resubmitted";

export interface IdType {
  value: string;
  label: string;
  description: string;
}

export interface StatusInfo {
  value: VerificationStatus;
  label: string;
  is_active: boolean;
  is_final: boolean;
}

export interface VerificationImages {
  government_id: string | null;
  business_cert: string | null;
  proof_of_address: string | null;
}

export interface RejectionReasons {
  business_name?: string;
  business_cert?: string;
  government_id?: string;
  proof_of_address?: string;
  business_address?: string;
  business_phone?: string;
  general?: string;
}

export interface VerificationUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  avatar: string | null;
  verified: boolean;
  created_at: string;
}

export interface VerificationReviewer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string | null;
}

export interface VerificationTimestamps {
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
}

export interface VerificationRequest {
  id: string;
  business_name: string;
  business_address: string;
  business_phone_number: string;
  id_type: IdType;
  status: StatusInfo;
  images: VerificationImages;
  rejection_reasons: RejectionReasons | null;
  user_message: string | null;
  admin_notes: string | null;
  can_resubmit: boolean;
  can_edit: boolean;
  is_active: boolean;
  is_final: boolean;
  submitted_at: string;
  reviewed_at: string | null;
  user: VerificationUser;
  reviewer: VerificationReviewer | null;
  timestamps: VerificationTimestamps;
}

export interface VerificationStatistics {
  total: number;
  pending: number;
  under_review: number;
  approved: number;
  rejected: number;
  resubmitted: number;
  active: number;
  today: number;
  this_week: number;
  this_month: number;
}

export interface VerificationRequestsMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  available_id_types: IdType[];
  available_statuses: StatusInfo[];
}

export interface VerificationRequestsLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface VerificationRequestsResponse {
  data: VerificationRequest[];
  meta: VerificationRequestsMeta;
  links: VerificationRequestsLinks;
}

export interface VerificationStatisticsResponse {
  data: VerificationStatistics;
}

export interface SingleVerificationRequestResponse {
  data: VerificationRequest;
}

export interface ReviewVerificationRequestData {
  status: "approved" | "rejected" | "under_review";
  user_message?: string;
  admin_notes?: string;
  rejection_reasons?: RejectionReasons;
}

export interface ReviewVerificationRequestResponse {
  message: string;
  data: VerificationRequest;
}

export interface DeleteVerificationRequestResponse {
  message: string;
}

export interface VerificationRequestFilters {
  page?: number;
  per_page?: number;
  status?: VerificationStatus;
  date_from?: string;
  date_to?: string;
  search?: string;
  reviewed_by?: string;
}
