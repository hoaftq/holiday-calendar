package hoaftq.holidaycalendar.sg;

public record Category(
        int term_id,
        String name,
        String slug,
        int term_group,
        int term_taxonomy_id,
        String taxonomy,
        String description,
        String color,
        int parent,
        int count,
        String filter,
        String term_order) {
}