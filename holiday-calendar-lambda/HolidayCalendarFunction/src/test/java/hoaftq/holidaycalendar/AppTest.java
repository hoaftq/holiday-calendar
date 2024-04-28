package hoaftq.holidaycalendar;

import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class AppTest {
    @Test
    public void successfulResponse() {
        App app = new App();
        var input = new APIGatewayProxyRequestEvent()
                .withBody("{\"countryIsoCode\": \"SG\", \"schoolGradleLevels\": [\"Kindergarten\", \"Primary\"]}");
        APIGatewayProxyResponseEvent result = app.handleRequest(input, null);
        assertEquals(200, result.getStatusCode().intValue());
        assertEquals("application/json", result.getHeaders().get("Content-Type"));
        String content = result.getBody();
        assertNotNull(content);
    }
}
