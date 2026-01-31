export type AdStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "expired"
  | "sold"
  | "active"
  | "suspended";
export type PromotionType = "bronze" | "silver" | "gold" | "platinum";

export interface Ad {
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
  promotion_plan_id: string | null;
  impressions: number;
  impressions_count: number;
  views: number;
  likes: number;
  status: AdStatus;
  published_at: string | null;
  expires_at: string | null;
  created_at: string;
  posted_at: string;
  updated_at: string;
  location: string;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
  };
  category?: {
    id: number;
    name: string;
  };
  subcategory?: {
    id: number;
    name: string;
  };
  state?: {
    id: number;
    name: string;
  };
  lga?: {
    id: number;
    name: string;
  };
  promotion_plan?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: string;
  } | null;
  primary_image?: {
    id: string;
    ad_id: string;
    image_path: string;
    is_primary: boolean;
  };
  images?: Array<{
    id: string;
    ad_id: string;
    image_path: string;
    is_primary: boolean;
  }>;
  transactions?: any[];
}
