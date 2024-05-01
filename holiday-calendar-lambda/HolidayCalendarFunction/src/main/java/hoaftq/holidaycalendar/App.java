package hoaftq.holidaycalendar;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import hoaftq.holidaycalendar.common.CalendarParserFactory;
import hoaftq.holidaycalendar.common.GradeLevel;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

/**
 * Handler for requests to Lambda function.
 */
public class App implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
    private static final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .setDateFormat(new SimpleDateFormat("yyyy-MM-dd"));

    public APIGatewayProxyResponseEvent handleRequest(final APIGatewayProxyRequestEvent input, final Context context) {
        if ("OPTIONS".equals(input.getHttpMethod())) {
            return createPreflightResponse();
        }

        try {
            final var request = objectMapper.readValue(input.getBody(), RequestDto.class);

            var parser = new CalendarParserFactory().getCalendarParser(request.countryIsoCode());
            var gradeLevels = getRequestGradleLevelsWithDefault(request);
            var holidays = parser.parse(gradeLevels);

            return createResponse(200, objectMapper.writeValueAsString(holidays));
        } catch (Exception e) {
            System.err.println(e);
            return createResponse(500, "{ message: Something went wrong. }");
        }
    }

    private static List<GradeLevel> getRequestGradleLevelsWithDefault(RequestDto request) {
        var requestGradleLevels = request.schoolGradleLevels();
        return requestGradleLevels == null || requestGradleLevels.isEmpty()
                ? Arrays.stream(GradeLevel.values()).toList()
                : requestGradleLevels;
    }

    private static APIGatewayProxyResponseEvent createPreflightResponse() {
        return new APIGatewayProxyResponseEvent()
                .withStatusCode(204)
                .withHeaders(new HashMap<>() {{
                    put("Access-Control-Allow-Origin", "*");
                    put("Access-Control-Allow-Methods", "POST");
                    put("Access-Control-Allow-Headers", "*");
                }});
    }

    private static APIGatewayProxyResponseEvent createResponse(int statusCode, String body) {
        return new APIGatewayProxyResponseEvent()
                .withStatusCode(statusCode)
                .withBody(body)
                .withHeaders(new HashMap<>() {{
                    put("Content-Type", "application/json");
                    put("X-Custom-Header", "application/json");
                    put("Access-Control-Allow-Origin", "*");
                }});
    }
}
