export interface NotificationData {
    type: string
    message: string
    ip_address?: string
    user_agent?: string
    logged_in_at?: string
    verification_request_id?: string
    business_name?: string
    user_id?: string
    user_name?: string
    user_email?: string
    status?: string
    action_url?: string
    ad_id?: string
    ad_title?: string
    transaction_id?: string
    amount?: string
    [key: string]: any
}

export interface AdminNotification {
    id: string
    type: string
    notifiable_type: string
    notifiable_id: string
    data: NotificationData
    read_at: string | null
    created_at: string
    updated_at: string
}

export interface NotificationPagination {
    current_page: number
    data: AdminNotification[]
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    links: {
        url: string | null
        label: string
        active: boolean
    }[]
    next_page_url: string | null
    path: string
    per_page: number
    prev_page_url: string | null
    to: number
    total: number
}

export interface NotificationResponse {
    success: boolean
    data: NotificationPagination
}

export interface UnreadCountResponse {
    success: boolean
    data: {
        unread_count: number
    }
}
