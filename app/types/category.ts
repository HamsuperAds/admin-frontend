
export interface Category {
    id: number;
    name: string;
    slug: string;
    image: string;
    adsCount: number;
    is_active: boolean;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface Subcategory {
    id: number;
    category_id: number;
    name: string;
    slug: string;
    image: string;
    adsCount: number;
    is_active: boolean;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    category: Category;
}
