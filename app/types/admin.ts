export interface Permission {
    id: number;
    name: string;
    description?: string;
    category?: string; // e.g., 'Users', 'Ads', 'Roles'
    created_at: string;
    updated_at: string;
}

export interface Role {
    id: number;
    name: string;
    description?: string;
    permissions_count: number;
    admins_count: number;
    created_at: string;
    updated_at: string;
    permissions?: Permission[];
}

export interface AdminCreator {
    id: string;
    first_name: string;
    last_name: string;
    middle_name: string | null;
    email: string;
    phone_number: string | null;
    gender: string | null;
    avatar: string | null;
    status: string;
}

export interface Admin {
    id: string;
    first_name: string;
    last_name: string;
    middle_name: string | null;
    email: string;
    email_verified_at: string | null;
    phone_number: string | null;
    gender: string | null;
    avatar: string | null;
    status: 'active' | 'inactive' | 'suspended'; 
    created_at: string;
    updated_at: string;
    last_login_at: string | null;
    created_by: string | null;
    creator?: AdminCreator | null;
    roles?: Role[];
    initials?: string;
    name?: string; // Kept for compatibility or computed use
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}
