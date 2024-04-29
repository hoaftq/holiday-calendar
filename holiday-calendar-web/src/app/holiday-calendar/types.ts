export enum GradleLevel {
    Kindergarten,
    Primary,
    Secondary,
    PostSecondary
}

export interface RequestDto {
    countryIsoCode: string,
    schoolGradleLevels?: GradleLevel[],
}

export enum HolidayType {
    PublicHoliday,
    SchoolHoliday
}

export interface ResponseDto {
    type: HolidayType,
    gradeLevels: GradleLevel[],
    name: string,
    from: Date,
    to: Date,
}