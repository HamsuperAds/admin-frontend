import type {
  VerificationRequestsResponse,
  VerificationStatisticsResponse,
  SingleVerificationRequestResponse,
  ReviewVerificationRequestData,
  ReviewVerificationRequestResponse,
  DeleteVerificationRequestResponse,
  VerificationRequestFilters,
} from "@/types/verificationRequest";

export const useVerificationRequests = () => {
  const { get, put, del, fetchGet, fetchPut, fetchDelete } = useApi();

  /**
   * Get all verification requests with filters (reactive)
   */
  const getVerificationRequests = (params: VerificationRequestFilters = {}) => {
    return get<VerificationRequestsResponse>("/verification-requests", {
      params,
    });
  };

  /**
   * Get verification statistics (reactive)
   */
  const getVerificationStatistics = () => {
    return get<VerificationStatisticsResponse>(
      "/verification-requests/statistics",
    );
  };

  /**
   * Get recent verification requests (reactive)
   */
  const getRecentVerificationRequests = (limit: number = 10) => {
    return get<VerificationRequestsResponse>("/verification-requests/recent", {
      params: { limit },
    });
  };

  /**
   * Get single verification request (reactive)
   */
  const getVerificationRequest = (id: string) => {
    return get<SingleVerificationRequestResponse>(
      `/verification-requests/${id}`,
    );
  };

  /**
   * Review verification request (immediate)
   */
  const reviewVerificationRequest = async (
    id: string,
    data: ReviewVerificationRequestData,
  ) => {
    return await fetchPut<ReviewVerificationRequestResponse>(
      `/verification-requests/${id}/review`,
      data,
    );
  };

  /**
   * Delete verification request (immediate)
   */
  const deleteVerificationRequest = async (id: string) => {
    return await fetchDelete<DeleteVerificationRequestResponse>(
      `/verification-requests/${id}`,
    );
  };

  /**
   * Get verification requests (immediate)
   */
  const fetchVerificationRequests = async (
    params: VerificationRequestFilters = {},
  ) => {
    return await fetchGet<VerificationRequestsResponse>(
      "/verification-requests",
      {
        params,
      },
    );
  };

  /**
   * Get verification statistics (immediate)
   */
  const fetchVerificationStatistics = async () => {
    return await fetchGet<VerificationStatisticsResponse>(
      "/verification-requests/statistics",
    );
  };

  return {
    // Reactive methods
    getVerificationRequests,
    getVerificationStatistics,
    getRecentVerificationRequests,
    getVerificationRequest,
    // Immediate methods
    reviewVerificationRequest,
    deleteVerificationRequest,
    fetchVerificationRequests,
    fetchVerificationStatistics,
  };
};
