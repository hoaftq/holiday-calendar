package hoaftq.holidaycalendar.common;

import hoaftq.holidaycalendar.sg.SgCalendarParser;

public class CalendarParserFactory {

    public CalendarParser getCalendarParser(String countryIsoCode) {
        if (countryIsoCode.equals("SG")) {
            return new SgCalendarParser();
        }

        // TODO need to show this message to users
        throw new RuntimeException("Country code is not supported. Support country codes are: SG");
    }
}
