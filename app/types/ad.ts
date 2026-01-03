export type AdStatus = "pending" | "approved" | "rejected" | "expired" | "sold";
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
  place: string;
  promotion_plan_id: number | null;
  status: AdStatus;
  published_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  location: string;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
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
  promotion_plan?: any; // Define properly if needed
  primary_image?: {
    id: string;
    ad_id: string;
    image_path: string;
  };
}
