package hoaftq.holidaycalendar.common;

import java.time.LocalDate;
import java.util.List;

public record Holiday(
        HolidayType type,
        List<GradeLevel> gradeLevels,
        String name,
        LocalDate from,
        LocalDate to
) {
}
