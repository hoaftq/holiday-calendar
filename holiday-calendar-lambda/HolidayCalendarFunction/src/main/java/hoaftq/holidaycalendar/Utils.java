package hoaftq.holidaycalendar;

import java.util.List;

public final class Utils {

    public static <T> boolean isIntersecting(List<T> list1, List<T> list2) {
        return list1.stream().anyMatch(list2::contains);
    }
}
