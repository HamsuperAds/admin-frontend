import type { Admin, Role, Permission, ApiResponse } from '@/types/admin';

export const useAdmins = () => {
    const { get, post, put, del } = useApi();

    // --- Admin Management ---

    const fetchAdmins = async (params: any = {}) => {
        return await get<ApiResponse<Admin[]>>('/admins', { params });
    };

    const fetchAdmin = async (id: string | number) => {
        return await get<ApiResponse<Admin>>(`/admins/${id}`);
    };

    const createAdmin = async (data: any) => {
        return await post<ApiResponse<Admin>>('/admins', data);
    };

    const updateAdmin = async (id: string | number, data: any) => {
        return await put<ApiResponse<Admin>>(`/admins/${id}`, data);
    };

    const deleteAdmin = async (id: string | number) => {
        return await del<ApiResponse<void>>(`/admins/${id}`);
    };

    const updateAdminStatus = async (id: string | number, status: 'active' | 'inactive') => {
        return await put<ApiResponse<Admin>>(`/admins/${id}/status`, { status });
    };

    const assignRoleToAdmin = async (userId: string | number, roleId: number) => {
        return await post<ApiResponse<void>>(`/admins/${userId}/roles`, { role_id: roleId });
    };

    const removeRoleFromAdmin = async (userId: string | number, roleId: number) => {
        return await del<ApiResponse<void>>(`/admins/${userId}/roles/${roleId}`);
    };

    // --- Role Management ---

    const fetchRoles = async () => {
        return await get<ApiResponse<Role[]>>('/roles');
    };

    const fetchRole = async (id: number) => {
        return await get<ApiResponse<Role>>(`/roles/${id}`);
    };

    const createRole = async (data: any) => {
        return await post<ApiResponse<Role>>('/roles', data);
    };

    const updateRole = async (id: number, data: any) => {
        return await put<ApiResponse<Role>>(`/roles/${id}`, data);
    };

    const deleteRole = async (id: number) => {
        return await del<ApiResponse<void>>(`/roles/${id}`);
    };

    // --- Permission Management ---

    const fetchPermissions = async () => {
        return await get<ApiResponse<Permission[]>>('/permissions');
    };

    const assignPermissionsToRole = async (roleId: number, permissionIds: number[]) => {
        return await post<ApiResponse<void>>(`/roles/${roleId}/permissions`, { permission_ids: permissionIds });
    };

    const syncRolePermissions = async (roleId: number, permissionIds: number[]) => {
        return await put<ApiResponse<void>>(`/roles/${roleId}/permissions/sync`, { permission_ids: permissionIds });
    };

    return {
        fetchAdmins,
        fetchAdmin,
        createAdmin,
        updateAdmin,
        deleteAdmin,
        updateAdminStatus,
        assignRoleToAdmin,
        removeRoleFromAdmin,
        fetchRoles,
        fetchRole,
        createRole,
        updateRole,
        deleteRole,
        fetchPermissions,
        assignPermissionsToRole,
        syncRolePermissions
    };
};
