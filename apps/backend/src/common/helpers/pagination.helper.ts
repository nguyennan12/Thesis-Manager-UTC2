// ==============================================================================
// PAGINATION HELPER (Standard Pagination Extraction & Response Formatting)
// ==============================================================================

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class PaginationHelper {
  static normalize(page?: number, limit?: number): { page: number; limit: number; skip: number } {
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));
    const skip = (pageNum - 1) * limitNum;
    return { page: pageNum, limit: limitNum, skip };
  }

  static paginate<T>(items: T[], total: number, page: number, limit: number): PaginatedResult<T> {
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }
}
