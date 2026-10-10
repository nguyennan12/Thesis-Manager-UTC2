import { SetMetadata } from '@nestjs/common';

export const POSITIONS_KEY = 'positions';
export const RequirePosition = (...positions: string[]) =>
  SetMetadata(POSITIONS_KEY, positions);
