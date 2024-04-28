package hoaftq.holidaycalendar;

import java.util.List;

public interface CalendarParser {
    List<Holiday> parse(List<GradeLevel> gradeLevels);
}
