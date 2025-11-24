export interface Ad {
  id: string | number;
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  image: string;
  location: string;
  date: string;
  seller?: {
    id: string;
    name: string;
    rating?: number;
  };
  status: "available" | "sold" | "reserved";
  condition: "new" | "used" | "refurbished";
  createdAt?: Date;
  updatedAt?: Date;
  tags?: string[];
}
