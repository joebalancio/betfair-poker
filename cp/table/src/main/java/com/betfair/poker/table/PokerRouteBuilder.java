package com.betfair.poker.table;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.Processor;
import org.apache.camel.builder.RouteBuilder;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import com.betfair.poker.game.Game;
import com.betfair.poker.player.Action;
import com.betfair.poker.player.Player;

public class PokerRouteBuilder extends RouteBuilder {
    private static final String notificationEndpoint = "http://np1.cp.sfo.us.betfair:8181/cxf/rs/notifications/alert";
    private static final String feEndpoint = "http://poker1-fe.cp.sfo.us.betfair:8080";

    private static final String GAME_END = "Game-End";
    private static final String GAME_START = "Game-Start";
    private static final String TABLE_RESET = "Table-Reset";
    
    public static final Log log = LogFactory.getLog(PokerRouteBuilder.class);
    
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
                        } else if ("table:reset".equals(name)) {
                            final Message message = exchange.getIn();
                            message.setHeader(TABLE_RESET, true);
                            resetTable();
                        }
                        
                        exchange.getOut().setBody("update websocket");
                    }
                })
                .choice()
                    .when(header(TABLE_RESET).isEqualTo(true))
                        .log(">>> Table Reset")
                .end()
                .to("direct:readTable")
                .to("direct:readPlayers")
                .delay(100)
                .to("seda:startGame")
                .delay(100)
                .to("seda:endGame")
                .end();

        from("direct:readTable")
                .routeId("direct:readTable")
                .process(new Processor() {
                  @Override
                  public void process(Exchange exchange) throws Exception {
                      exchange.getOut().setBody(readTable());
                  }
                })
                .log(">>> Message sending to WebSocket Client: ${body}")
                .to("websocket://poker?sendToAll=true")
                .end();
        
        from("direct:readPlayers")
            .routeId("direct:readPlayers")
            .process(new Processor() {
                @Override
                public void process(Exchange exchange) throws Exception {
                    exchange.getOut().setBody(readPlayers());
                }
            })
            .log(">>> Message sending to WebSocket Client: ${body}")
            .to("websocket://poker?sendToAll=true")
            .end();
        
        from("seda:startGame")
            .routeId("seda:startGame")
            .process(new Processor() {
                @Override
                public void process(Exchange exchange) throws Exception {
                    final Message message = exchange.getIn();
                    
                    if (startGame()) {
                        message.setHeader(GAME_START, true);
                    } else {
                        message.setHeader(GAME_START, false);
                    }
                }
            })
            .choice()
                .when(header(GAME_START).isEqualTo(true))
                    .log(">>> Game Starting")
                    .to("seda:notifyStart")
                    .to("direct:readTable")
                    .to("direct:readPlayers")
            .end()
            .end();
        
        from("seda:endGame")
            .routeId("seda:endGame")
            .process(new Processor() {
                @Override
                public void process(Exchange exchange) throws Exception {
                    final Message message = exchange.getIn();
                    
                    if (endGame()) {
                        message.setHeader(GAME_END, true);
                    } else {
                        message.setHeader(GAME_END, false);
                    }
                }
            })
            .choice()
                .when(header(GAME_END).isEqualTo(true))
                    .log(">>> Game Ended")
                    .to("seda:notifyEnd")
                    .delay(3000)
                    .to("direct:readTable")
                    .to("direct:readPlayers")
                    .delay(3000)
                    .to("seda:startGame")
            .end()
            .end();
        
        from("seda:notifyStart")
            .routeId("direct:notifyStart")
            .process(new Processor() {
                @Override
                public void process(Exchange exchange) throws Exception {
                    exchange.getOut().setBody("Poker Game Started.  <a href=\"" + feEndpoint + "\">Watch here!</a>");
                }
            })
            .log(">>> Message sending to Notification Client: ${body}")
            .setHeader(Exchange.HTTP_METHOD, constant("POST"))
            .to(notificationEndpoint)
            .end();
        
        from("seda:notifyEnd")
            .routeId("direct:notifyEnd")
            .process(new Processor() {
                @Override
                public void process(Exchange exchange) throws Exception {
                    exchange.getOut().setBody("Poker Game is about to start.  <a href=\"" + feEndpoint + "\">Join here!</a>");
                }
            })
            .log(">>> Message sending to Notification Client: ${body}")
            .setHeader(Exchange.HTTP_METHOD, constant("POST"))
            .to(notificationEndpoint)
            .end();
        }

    public void resetTable() {
        table.reset();
    }
                
    public boolean startGame() {
        Game game = table.getGame();

        if (!game.isPlaying()) {
            game = table.newGame();
            List<Seat> activeSeats = new ArrayList<Seat>();

            for (Seat seat : table.getSeats()) {
                if (!seat.isEmpty()) {
                    final Player player = seat.getPlayer();

                    if (player.getCash() >= table.getBigBlind()) {
                        activeSeats.add(seat);
                    }
                }
            }

            if (activeSeats.size() > 2) {
                game.setActiveSeats(activeSeats);
                table.setSeatDealer();
                game.initGame();
                return true;
            }
        }
        
        return false;
    }

    public boolean endGame() {
        Game game = table.getGame();

        
        if (game.isGameCompleted()) {
            game.reset();
            
            for (Seat seat : table.getSeats()) {
                seat.reset();
            }

            table.changeDealer();
            
            return true;
        }
        
        return false;
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
            
            if ((player.getHand() != null) && (player.getHand().getHoleCards() != null)) {
                innerMap.put("cards", player.getHand().getHoleCards().getCards());
            }
            
            innerMap.put("seat", seat.getPosition());
            innerMap.put("position", seat.getGamePosition());
            innerMap.put("avatar", player.getAvatar());

            if (seat.isWinner()) {
                innerMap.put("status", "WINNER");
            } else if (seat.isTurn()) {
                innerMap.put("status", "TURN");
            } else {
                innerMap.put("status", player.getAction());
            }

            if (seat.isTurn()) {
                innerMap.put("actions", game.getAllowedActions(player));
            } else {
                innerMap.put("actions", new HashSet<Action>());
            }
         
            list.add(innerMap);

            map.put("args", list);
        }

        return mapToJson(map);
    }

    public void createPlayer(final Map<String, Object> map) {
        final String name = (String) map.get("name");
        final String avatar = (String) map.get("avatar");

        Player player = new Player(name);
        player.setAvatar(avatar);
        table.addPlayer(player);
    }

    public void deletePlayer(final Map<String, Object> map) {
        final Integer position = (Integer) map.get("seat");
        final Seat seat = table.getSeat(position);

        if (!seat.isEmpty()) {
            final Player player = seat.getPlayer();
            final Game game = table.getGame();
            game.playHand(seat.getPosition(), Action.FOLD, 0);
            game.removeSeat(seat.getPosition());

            table.removePlayer(position);
        }
    }

    public void updatePlayer(final Map<String, Object> map) {
        final Integer pos = (Integer) map.get("seat");
        final String action = (String) map.get("action");
        Integer amount = (Integer) map.get("amount");
        
        if (amount == null) {
            amount = 0;
        }
        
        final Game game = table.getGame();
        final Seat seat = game.getSeat(pos);

        if ((seat != null) && (!seat.isEmpty())) {
            final Player player = seat.getPlayer();
            game.playHand(pos, Action.fromName(action), amount);
        }
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

                if ((player.getHand() != null) && (player.getHand().getHoleCards() != null)) {
                    innerMap.put("cards", player.getHand().getHoleCards().getCards());
                }
                
                innerMap.put("seat", seat.getPosition());
                innerMap.put("position", seat.getGamePosition());
                innerMap.put("avatar", player.getAvatar());

                if (seat.isWinner()) {
                    innerMap.put("status", "WINNER");
                } else if (seat.isTurn()) {
                    innerMap.put("status", "TURN");
                } else {
                    innerMap.put("status", player.getAction());
                }

                if (seat.isTurn()) {
                    innerMap.put("actions", game.getAllowedActions(player));
                } else {
                    innerMap.put("actions", new HashSet<Action>());
                }
                
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
