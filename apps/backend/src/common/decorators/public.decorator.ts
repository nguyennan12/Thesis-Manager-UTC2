// ==============================================================================
// PUBLIC ROUTE DECORATOR
// ==============================================================================

import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorator đánh dấu Endpoint không yêu cầu xác thực JWT (Public Endpoint)
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
