package hoaftq.holidaycalendar;

import hoaftq.holidaycalendar.common.GradeLevel;

import java.util.List;

public record RequestDto(
        String countryIsoCode,
        List<GradeLevel> schoolGradleLevels
) {
}
