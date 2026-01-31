export type TransactionStatus =
  | "successful"
  | "pending"
  | "failed"
  | "refunded";
export type PaymentMethod = "paystack" | "bank_transfer" | "cash";
export type PaymentChannel = "card" | "bank" | "ussd" | "qr" | null;

export interface PromotionPlan {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  icon: string;
  color: string;
  on_top_duration_hours: number;
  auto_renew_interval_hours: number;
  srp_promotion_days: number;
  email_marketing_enabled: boolean;
  is_active: boolean;
  display_order: number;
  adsCount: number;
  created_by: string;
  previous_version_id: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface TransactionMetadata {
  ad_id: string;
  ad_title: string;
  new_plan: string;
  old_plan: string;
  access_code: string;
  payment_url: string;
}

export interface Transaction {
  id: string;
  ad_id: string;
  user_id: string;
  promotion_plan_id: string;
  amount: string;
  reference: string;
  paystack_reference: string;
  status: TransactionStatus;
  payment_method: PaymentMethod;
  payment_channel: PaymentChannel;
  approved_by: string | null;
  admin_comment: string | null;
  description: string;
  metadata: TransactionMetadata;
  paid_at: string | null;
  expires_at: string | null;
  is_expired: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  ad?: {
    id: string;
    user_id: string;
    title: string;
    slug: string;
    category_id: number;
    subcategory_id: number;
    state_id: number;
    lga_id: number;
    price: string;
    is_negotiable: boolean;
    place: string;
    description: string;
    promotion_plan_id: string;
    impressions: number;
    impressions_count: number;
    views: number;
    likes: number;
    status: string;
    published_at: string | null;
    expires_at: string | null;
    created_at: string;
    posted_at: string;
    updated_at: string;
    location: string;
    lga?: {
      id: number;
      state_id: number;
      name: string;
      slug: string;
      image: string | null;
      adsCount: number;
      is_active: boolean;
      deleted_at: string | null;
      created_at: string;
      updated_at: string;
    };
    state?: {
      id: number;
      name: string;
      slug: string;
      image: string | null;
      adsCount: number;
      is_active: boolean;
      deleted_at: string | null;
      created_at: string;
      updated_at: string;
    };
  };
  user?: {
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
    state_id: number | null;
    lga_id: number | null;
    town: string | null;
    date_of_birth: string | null;
    verified: boolean;
    avatar: string | null;
    device_token: string | null;
    adsCount: number;
    status: "active" | "inactive" | "suspended";
    created_at: string;
    updated_at: string;
    last_seen: string | null;
    deleted_at: string | null;
  };
  promotion_plan?: PromotionPlan;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface TransactionsPaginatedResponse {
  current_page: number;
  data: Transaction[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface TransactionsApiResponse {
  success: boolean;
  data: TransactionsPaginatedResponse;
}

export interface TransactionStats {
  name: string;
  value: string | number;
  icon: string;
}

export interface TransactionStatsData {
  total_transactions: number;
  successful_transactions: number;
  pending_transactions: number;
  failed_transactions: number;
  cancelled_transactions: number;
  total_revenue: string;
  expired_promotions: number;
}

export interface TransactionStatsResponse {
  success: boolean;
  data: TransactionStatsData;
}
