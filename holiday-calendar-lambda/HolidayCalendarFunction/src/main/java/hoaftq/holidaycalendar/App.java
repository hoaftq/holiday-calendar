package hoaftq.holidaycalendar;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.joda.JodaModule;
import hoaftq.holidaycalendar.common.CalendarParserFactory;
import hoaftq.holidaycalendar.common.GradeLevel;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Handler for requests to Lambda function.
 */
public class App implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    private static final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JodaModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    public APIGatewayProxyResponseEvent handleRequest(final APIGatewayProxyRequestEvent input, final Context context) {
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("X-Custom-Header", "application/json");

        APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent().withHeaders(headers);
        try {
            final var request = objectMapper.readValue(input.getBody(), RequestDto.class);

            var parser = new CalendarParserFactory().getCalendarParser(request.countryIsoCode());
            var gradeLevels = getRequestGradleLevelsWithDefault(request);
            var holidays = parser.parse(gradeLevels);

            return response
                    .withStatusCode(200)
                    .withBody(objectMapper.writeValueAsString(holidays));
        } catch (Exception e) {
            System.err.println(e);
            return response
                    .withBody("{ message: Something went wrong. }")
                    .withStatusCode(500);
        }
    }

    private static List<GradeLevel> getRequestGradleLevelsWithDefault(RequestDto request) {
        var requestGradleLevels = request.schoolGradleLevels();
        return requestGradleLevels == null || requestGradleLevels.isEmpty()
                ? Arrays.stream(GradeLevel.values()).toList()
                : requestGradleLevels;
    }
}
