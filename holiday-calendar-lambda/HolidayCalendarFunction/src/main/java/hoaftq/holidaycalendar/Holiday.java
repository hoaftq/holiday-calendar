package hoaftq.holidaycalendar;

import org.joda.time.DateTime;

import java.util.List;

public record Holiday(
        HolidayType type,
        List<GradeLevel> gradeLevels,
        String name,
        DateTime from,
        DateTime to
) {
}
