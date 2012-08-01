package com.betfair.poker.table;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.camel.builder.RouteBuilder;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import com.betfair.poker.game.Game;
import com.betfair.poker.player.Player;

public class PokerRouteBuilder extends RouteBuilder {

    private String fromEndpoint;
    private String toEndpoint;
    private Table table;
    private final ObjectMapper mapper = new ObjectMapper();

    public PokerRouteBuilder() {

    }

    @Override
    public void configure() throws Exception {
        // from(fromEndpoint)
        // .routeId(fromEndpoint)
        // .marshal().json()
        // .unmarshal().json()
        // .to(toEndpoint);

        // expose a chat websocket client, that sends back an echo
        from("websocket://poker").routeId("pokerWebsocket")
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
                        String msg = exchange.getIn().getBody().toString();
                        System.out.println(msg);
                    }
                }).to("websocket://poker");
    }

    private void startGame() {
        Game game = table.getGame();

        if (!game.isPlaying()) {
            List<Seat> activeSeats = new ArrayList<Seat>();

            for (Seat seat : table.getSeats()) {
                if (!seat.isEmpty()) {
                    final Player player = seat.getPlayer();

                    if (player.getCash() >= table.getBigBlind()) {
                        activeSeats.add(seat);
                    }
                }
            }

            if (activeSeats.size() > 1) {
                game.setActiveSeats(activeSeats);
                game.playHand();
            }
        }

    }

    private void endGame() {
        Game game = table.getGame();

        if (game.isHandCompleted()) {
            game.payPots();
            game.reset();
            table.setSeatDealer();
        }
    }

    private String readPlayer() {
        return null;
    }

    private String createPlayer(final Map<String, Object> map) {
        startGame();
        return null;
    }

    private String deletePlayer(final Map<String, Object> map) {
        return null;
    }

    private String updatePlayer(final Map<String, Object> map) {
        return null;
    }

    private String readPlayers() {
        return null;
    }

    private String readTable() {
        return null;
    }

    private Map<String, Object> jsonToMap(final String json) {
        try {
            Map<String, Object> map = mapper.readValue(json,
                    new TypeReference<Map<String, Object>>() {
                    });
            return map;
        } catch (final Exception e) {
            return new HashMap<String, Object>();
        }
    }

    private String mapToJson(final Map<String, Object> map) {
        try {
            return mapper.writeValueAsString(map);
        } catch (final Exception e) {
            return null;
        }
    }

    public void setFromEndpoint(final String fromEndpoint) {
        this.fromEndpoint = fromEndpoint;
    }

    public void setToEndpoint(final String toEndpoint) {
        this.toEndpoint = toEndpoint;
    }

    public void setTable(final Table table) {
        this.table = table;
    }
}
