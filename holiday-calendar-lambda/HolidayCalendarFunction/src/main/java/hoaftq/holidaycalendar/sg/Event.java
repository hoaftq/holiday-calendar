package hoaftq.holidaycalendar.sg;

import java.util.List;

public record Event(
        String title,
        List<String> groupNames,
        Category category,
        String eventBody,
        boolean hideDay,
        String start,
        String end,
        String link,
        String className,
        String icsFile) {
}
