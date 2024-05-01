import { GradleLevel } from './api-types';

export interface DayType {
  isPublicHoliday: boolean;
  isSchoolHoliday: boolean;
  gradeLevels: GradleLevel[];
}
