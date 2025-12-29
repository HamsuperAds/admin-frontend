export type AdStatus = "pending" | "approved" | "rejected" | "expired" | "sold";
export type PromotionType = "bronze" | "silver" | "gold" | "platinum";

export interface Ad {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  category_id: number;
  subcategory_id: number;
  price: number;
  state: string;
  lga: string;
  town: string;
  description: string;
  impressions: number;
  views: number;
  likes: number;
  status: AdStatus;
  promotion_type: PromotionType;
  published_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}
