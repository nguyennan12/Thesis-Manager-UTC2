'use client';

import { useQuery } from '@tanstack/react-query';
import { councilService } from '@/services/council.service';
import { CouncilItem } from '@/types/council';

export function useLecturerCouncils() {
  const { data: councils = [], isLoading } = useQuery<CouncilItem[]>({
    queryKey: ['lecturer-councils'],
    queryFn: () => councilService.getCouncils(),
  });

  return {
    councils,
    isLoading,
  };
}
