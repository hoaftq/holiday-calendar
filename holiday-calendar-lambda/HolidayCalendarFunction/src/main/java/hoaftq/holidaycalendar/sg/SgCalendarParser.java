package hoaftq.holidaycalendar.sg;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import hoaftq.holidaycalendar.Utils;
import hoaftq.holidaycalendar.common.CalendarParser;
import hoaftq.holidaycalendar.common.GradeLevel;
import hoaftq.holidaycalendar.common.Holiday;
import hoaftq.holidaycalendar.common.HolidayType;

import javax.net.ssl.HttpsURLConnection;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.time.LocalDate;
import java.util.List;

public class SgCalendarParser implements CalendarParser {

    private static final String MoeCalendarUrl = "https://www.moe.gov.sg/api/v1/calendar/getAllResults";

    @Override
    public List<Holiday> parse(List<GradeLevel> gradeLevels) {
        try {
            var events = getCalendarData(MoeCalendarUrl);
            return events.stream()
                    .filter(e -> isPublicHoliday(e.category().slug()) || isSchoolHoliday(e.category().slug()))
                    .filter(e -> Utils.isIntersecting(getGradeLevels(e), gradeLevels))
                    .map(SgCalendarParser::mapEventToHoliday)
                    .toList();

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static List<Event> getCalendarData(String address) throws IOException {
        var url = URI.create(address).toURL();
        var connection = (HttpsURLConnection) url.openConnection();
        connection.setRequestMethod("POST");

        if (connection.getResponseCode() == HttpsURLConnection.HTTP_OK) {
            return parseSource(connection.getInputStream());
        }

        return List.of();
    }

    private static List<Event> parseSource(InputStream stream) throws IOException {
        var mapper = new ObjectMapper();
        return mapper.readValue(stream, new TypeReference<>() {
        });
    }

    private static GradeLevel mapGradeLevel(String gradeLevel) {
        return switch (gradeLevel) {
            case "MOE Kindergarten (MK)" -> GradeLevel.Kindergarten;
            case "Primary" -> GradeLevel.Primary;
            case "Secondary" -> GradeLevel.Secondary;
            case "Post-secondary" -> GradeLevel.PostSecondary;
            default ->
                    throw new IllegalArgumentException(String.format("Gradle level %s is not supported", gradeLevel));
        };
    }

    private static Holiday mapEventToHoliday(Event event) {
        var holidayType = isPublicHoliday(event.category().slug()) ? HolidayType.PublicHoliday : HolidayType.SchoolHoliday;
        var gradeLevels = getGradeLevels(event);
        var startDate = LocalDate.parse(event.start());

        LocalDate endDate = null;
        if (!event.end().isEmpty()) {
            endDate = LocalDate.parse(event.end());
        }

        return new Holiday(holidayType, gradeLevels, event.title(), startDate, endDate);
    }

    private static List<GradeLevel> getGradeLevels(Event event) {
        return event.groupNames().stream().map(SgCalendarParser::mapGradeLevel).toList();
    }

    private static boolean isPublicHoliday(String slug) {
        return "public-holidays".equals(slug);
    }

    private static boolean isSchoolHoliday(String slug) {
        return "school-holidays".equals(slug);
    }
}
