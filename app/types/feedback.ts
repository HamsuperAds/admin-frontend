import type { User } from './user'

export interface FeedbackStats {
    total_feedback: number
    useful_counts: string | number // The sample showed "1" as string, but usually these are numbers. I'll allow both to be safe or parse it.
    unclear_count: number
    offensive_count: number
}

export interface Feedback {
    id: string
    from_user_id: string
    to_user_id: string
    message: string
    rating: number
    status: 'visible' | 'hidden' | 'deleted' | string
    helpful_count: number
    unclear_count: number
    offensive_count: number
    deleted_at: string | null
    created_at: string
    updated_at: string
    from_user?: User
    to_user?: User
    replies?: any[]
}

export interface FeedbackResponse {
    success: boolean
    data: Feedback[]
    pagination: {
        current_page: number
        per_page: number
        total: number
        last_page: number
        from: number
        to: number
        has_more_pages: boolean
    }
}

export interface FeedbackStatsResponse {
    success: boolean
    data: FeedbackStats
}
