export interface Attribute {
    id: number;
    name: string;
    slug: string;
    type: string;
    options: string[] | null;
    unit: string | null;
    rules: any;
    table_name: string;
    category_id: number;
    created_at: string;
    updated_at: string;
    subcategories?: any[];
}
