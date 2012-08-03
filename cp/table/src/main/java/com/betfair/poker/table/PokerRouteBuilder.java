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
import com.betfair.poker.player.Action;
import com.betfair.poker.player.Player;

public class PokerRouteBuilder extends RouteBuilder {
    private Table table;
    private final ObjectMapper mapper = new ObjectMapper();

    public PokerRouteBuilder() {
    }

    @Override
    public void configure() throws Exception {
        // expose a chat websocket client
        from("websocket://poker")
                .routeId("pokerWebsocket")
                .log(">>> Message received from WebSocket Client: ${body}")
                //.transform().simple("${body}${body}")
                .process(new Processor() {
                    @Override
                    public void process(Exchange exchange) throws Exception {
                        final String msg = exchange.getIn().getBody().toString();
                        System.out.println(msg);
                        final Map<String, Object> map = jsonToMap(msg);
                        final String name = (String) map.get("name");
                        
                        if ("player:update".equals(name)) {
                            final List<Map<String, Object>> list = (List<Map<String, Object>>) map.get("args");
                            final Map<String, Object> data = list.get(0);
                            updatePlayer(data);
                        } else if ("player:create".equals(name)) {
                            final List<Map<String, Object>> list = (List<Map<String, Object>>) map.get("args");
                            final Map<String, Object> data = list.get(0);
                            createPlayer(data);
                        } else if ("player:delete".equals(name)) {
                            final List<Map<String, Object>> list = (List<Map<String, Object>>) map.get("args");
                            final Map<String, Object> data = list.get(0);
                            deletePlayer(data);
                        }
                        
                        exchange.getOut().setBody("update websocket");
                    }
                })
                .to("direct:readTable")
                .to("direct:readPlayers");

        from("direct:readTable")
                .routeId("direct:readTable")
                .process(new Processor() {
                  @Override
                  public void process(Exchange exchange) throws Exception {
                      String msg = exchange.getIn().getBody().toString();
                      System.out.println(msg);
                      exchange.getOut().setBody(readTable());
                  }
                })
                .log(">>> Message sending to WebSocket Client: ${body}")
                .to("websocket://poker?sendToAll=true");
        
        from("direct:readPlayers")
            .routeId("direct:readPlayers")
            .process(new Processor() {
                @Override
                public void process(Exchange exchange) throws Exception {
                    String msg = exchange.getIn().getBody().toString();
                    System.out.println(msg);
                    exchange.getOut().setBody(readPlayers());
                }
            })
            .log(">>> Message sending to WebSocket Client: ${body}")
            .to("websocket://poker?sendToAll=true");
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
                game.initGame();
            }
        }
    }

    private void endGame() {
        Game game = table.getGame();

        if (game.isGameCompleted()) {
            game.payPots();
            game.reset();
            table.setSeatDealer();
        }
    }

    public String readPlayer(final Map<String, Object> inMap) {
        final Integer position = (Integer) inMap.get("seat");

        Map<String, Object> map = new HashMap<String, Object>();
        Map<String, Object> innerMap = new HashMap<String, Object>();
        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();

        map.put("name", "player:read");

        final Seat seat = table.getSeat(position);

        if (!seat.isEmpty()) {
            final Player player = seat.getPlayer();
            final Game game = table.getGame();

            innerMap.put("name", player.getName());
            innerMap.put("id", player.getId());
            innerMap.put("chips", player.getCash());
            innerMap.put("seat", seat.getPosition());
            innerMap.put("position", seat.getGamePosition());
            innerMap.put("avatar", player.getAvatar());

            if (seat.isTurn()) {
                innerMap.put("status", player.getStatus());
            } else {
                innerMap.put("status", "turn");
            }

            innerMap.put("actions", game.getAllowedActions(player));
            list.add(innerMap);

            map.put("args", list);
        }

        return mapToJson(map);
    }

    private void createPlayer(final Map<String, Object> map) {
        final Integer id = (Integer) map.get("id");
        final Integer pos = (Integer) map.get("seat");
        final String name = (String) map.get("name");
        final String avatar = (String) map.get("avatar");

        Player player = new Player(name, id);
        player.setAvatar(avatar);
        table.addPlayer(player, pos);

        startGame();
    }

    private void deletePlayer(final Map<String, Object> map) {
        final Integer position = (Integer) map.get("seat");
        final Seat seat = table.getSeat(position);

        if (!seat.isEmpty()) {
            final Player player = seat.getPlayer();
            final Game game = table.getGame();

            game.removeSeat(seat.getPosition());

            table.removePlayer(position);
        }
    }

    private void updatePlayer(final Map<String, Object> map) {
        final Integer id = (Integer) map.get("id");
        final Integer pos = (Integer) map.get("seat");
        final String action = (String) map.get("action");
        final Integer amount = (Integer) map.get("amount");

        final Game game = table.getGame();
        final Seat seat = game.getSeat(pos);

        if (!seat.isEmpty()) {
            final Player player = seat.getPlayer();
            game.playHand(pos, Action.fromName(action), amount);
        }

        endGame();
    }

    public String readPlayers() {
        Map<String, Object> map = new HashMap<String, Object>();
        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
        List<List<Map<String, Object>>> list2 = new ArrayList<List<Map<String, Object>>>();
        final Game game = table.getGame();

        map.put("name", "players:read");

        for (Seat seat : table.getSeats()) {
            if (!seat.isEmpty()) {
                Player player = seat.getPlayer();
                Map<String, Object> innerMap = new HashMap<String, Object>();

                innerMap.put("name", player.getName());
                innerMap.put("id", player.getId());
                innerMap.put("chips", player.getCash());
                innerMap.put("seat", seat.getPosition());
                innerMap.put("position", seat.getGamePosition());
                innerMap.put("avatar", player.getAvatar());

                if (seat.isTurn()) {
                    innerMap.put("status", player.getStatus());
                } else {
                    innerMap.put("status", "turn");
                }

                innerMap.put("actions", game.getAllowedActions(player));
                list.add(innerMap);
            }
        }

        list2.add(list);

        map.put("args", list2);

        return mapToJson(map);
    }

    public String readTable() {
        Map<String, Object> map = new HashMap<String, Object>();
        Map<String, Object> innerMap = new HashMap<String, Object>();
        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();

        map.put("name", "table:read");

        innerMap.put("cards", table.getGame().getCommunityCards().getCards());
        innerMap.put("pot", table.getGame().getPot());
        innerMap.put("status", table.getGame().getStatus());
        list.add(innerMap);

        map.put("args", list);

        return mapToJson(map);
    }

    public Map<String, Object> jsonToMap(final String json) {
        try {
            Map<String, Object> map = mapper.readValue(json,
                    new TypeReference<Map<String, Object>>() {
                    });
            return map;
        } catch (final Exception e) {
            return new HashMap<String, Object>();
        }
    }

    public String mapToJson(final Map<String, Object> map) {
        try {
            return mapper.writeValueAsString(map);
        } catch (final Exception e) {
            return null;
        }
    }

    public void setTable(final Table table) {
        this.table = table;
    }
}
