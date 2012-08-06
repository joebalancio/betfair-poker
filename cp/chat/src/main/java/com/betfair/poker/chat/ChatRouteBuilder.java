package com.betfair.poker.chat;

import org.apache.camel.builder.RouteBuilder;

public class ChatRouteBuilder extends RouteBuilder {
    
    public ChatRouteBuilder() {
    }

    @Override
    public void configure() throws Exception {
        // from(fromEndpoint)
        // .routeId(fromEndpoint)
        // .marshal().json()
        // .unmarshal().json()
        // .to(toEndpoint);

        // expose a chat websocket client, that sends back an echo
        from("websocket://chat")
            .routeId("chatWebsocket")
            .log(">>> Message received from WebSocket Client : ${body}")
            .transform().simple("${body}${body}")
            // send back to the client, by sending the message to the same
            // endpoint
            // this is needed as by default messages is InOnly
            // and we will by default send back to the current client using
            // the provided connection key
            .to("websocket://chat?sendToAll=true");
    }
}
