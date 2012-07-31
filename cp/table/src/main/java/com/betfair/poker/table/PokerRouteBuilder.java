package com.betfair.poker.table;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.camel.builder.RouteBuilder;


public class PokerRouteBuilder extends RouteBuilder {

    private String fromEndpoint;
    private String toEndpoint;
    private Table table;
    
    public PokerRouteBuilder() {
        table.start();
    }

    @Override
    public void configure() throws Exception {
        // from(fromEndpoint)
        // .routeId(fromEndpoint)
        // .marshal().json()
        // .unmarshal().json()
        // .to(toEndpoint);

        // expose a chat websocket client, that sends back an echo
        from("websocket://poker")
            .routeId("pokerWebsocket")
            .log(">>> Message received from WebSocket Client : ${body}")
            .transform().simple("${body}${body}")
            // send back to the client, by sending the message to the same
            // endpoint
            // this is needed as by default messages is InOnly
            // and we will by default send back to the current client using
            // the provided connection key
             .process(new Processor() {
              @Override
              public void process(Exchange exchange) throws Exception {
                  System.out.println(exchange.getIn().getBody());
              }
            })
            .to("websocket://poker");
    }

    public void setFromEndpoint(String fromEndpoint) {
        this.fromEndpoint = fromEndpoint;
    }

    public void setToEndpoint(String toEndpoint) {
        this.toEndpoint = toEndpoint;
    }
}
