export enum GradleLevel {
  Kindergarten = 'Kindergarten',
  Primary = 'Primary',
  Secondary = 'Secondary',
  PostSecondary = 'PostSecondary',
}

export interface RequestDto {
  countryIsoCode: string;
  schoolGradleLevels?: GradleLevel[];
}

export enum HolidayType {
  PublicHoliday = 'PublicHoliday',
  SchoolHoliday = 'SchoolHoliday',
}

export interface Holiday {
  type: HolidayType;
  gradeLevels: GradleLevel[];
  name: string;
  from: string;
  to: string | null;
}

export type ResponseDto = Holiday[];
