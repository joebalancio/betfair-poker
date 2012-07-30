package com.betfair.poker.chat;

import org.apache.camel.builder.RouteBuilder;

public class ChatRouteBuilder extends RouteBuilder {

    private String fromEndpoint;
    private String toEndpoint;

    public ChatRouteBuilder() {
    }

    @Override
    public void configure() throws Exception {
        // TODO add exceptions handling
        from(fromEndpoint).routeId(fromEndpoint)
        // .marshal().json()
        // .unmarshal().json()
                .to(toEndpoint);
    }

    public void setFromEndpoint(String fromEndpoint) {
        this.fromEndpoint = fromEndpoint;
    }

    public void setToEndpoint(String toEndpoint) {
        this.toEndpoint = toEndpoint;
    }
}
