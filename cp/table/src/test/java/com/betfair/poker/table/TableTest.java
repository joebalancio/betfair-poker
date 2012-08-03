package com.betfair.poker.table;

import java.util.ArrayList;
import java.util.List;

import org.testng.Assert;
import org.testng.annotations.Test;

import com.betfair.poker.game.Game;
import com.betfair.poker.player.Action;
import com.betfair.poker.player.Player;

public class TableTest {
    @Test
    public void defaulConstructorTest() throws Exception {
        Table table = new Table();
        Assert.assertNotNull(table);
        //Assert.assertEquals("Heart", card.getSuit());
    }
    
    
    @Test
    public void testTheWholeThing() throws Exception {
    	
    	Table table = new Table(4, 50);

        Player player1 = new Player("John", 1);
        player1.setAvatar("John");
        table.addPlayer(player1, 0);
        Player player2 = new Player("Joe", 2);
        player2.setAvatar("Joe");
        table.addPlayer(player2, 1);
        Player player3 = new Player("Jack", 3);
        player3.setAvatar("Jack");
        table.addPlayer(player3, 2);
        Player player4 = new Player("Jerry", 4);
        player4.setAvatar("Jerry");
        table.addPlayer(player4, 3);
        table.setSeatDealer();
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
        List<Seat> seats = game.getActiveSeats();
        System.out.println("PLayers to act "+game.getPlayersToAct());
        for(int i=0; i<seats.size(); i++)
        {
        	Seat seat = seats.get(i);
        	System.out.println(i + "::isDealer::" + seat.isDealer());
        	System.out.println(i + "::isSmallBlind::" + seat.isSmallBlind());
        	System.out.println(i + "::isBigBlind::" + seat.isBigBlind());
        	
        	System.out.println("Hand::: "+seat.getPlayer().getHand().getCards().length);
        }
        System.out.println(game.getAllowedActions(seats.get(3).getPlayer()));
        System.out.println("is turn of 3" + game.getSeat(3).isTurn());
        game.playHand(3, Action.CALL, 4);
        System.out.println(seats.get(3).getPlayer().getCash());
        System.out.println("is turn of 0" + game.getSeat(0).isTurn());
        game.playHand(0, Action.FOLD, 0);
        System.out.println(game.getActiveSeats().size());
        System.out.println("is turn of 1" + game.getSeat(1).isTurn());
        game.playHand(1, Action.CALL, 2);
        System.out.println("is turn of 2" + game.getSeat(2).isTurn());
        game.playHand(2, Action.CHECK, 0);
        //game.playHand(3, Action.CHECK, 0);
        System.out.println("Community card size "+game.getActiveSeats().get(3).getPlayer().getHand().getCommunityCards().size());
        System.out.println("is hand complete "+game.isHandCompleted());
        System.out.println("is game complete "+game.isGameCompleted());
        
        //FLOP
       // System.out.println("Allowed action of player joe "+game.getAllowedActions(seats.get(1).getPlayer()));
        game.playHand(1, Action.CALL, 2);
        game.playHand(2, Action.RAISE, 8);
        game.playHand(3, Action.CALL, 8);
        System.out.println("Is tuen of joe "+game.getActiveSeats().get(1).isTurn());
        System.out.println("Allowed action of player joe "+game.getAllowedActions(seats.get(1).getPlayer()));
        game.playHand(1, Action.CALL, 6);
        System.out.println("Players to act "+game.getPlayersToAct());
        System.out.println("Game status "+game.getStatus());
        
        //Turn
        game.playHand(1, Action.FOLD, 0);
        System.out.println("players to act 1 "+game.getPlayersToAct());
        game.playHand(2, Action.RAISE, 8);
        System.out.println("players to act 2 "+game.getPlayersToAct());
        game.playHand(3, Action.CALL, 8);
        System.out.println("Players to act 3 "+game.getPlayersToAct());
        
        System.out.println("Game status "+game.getStatus());
        System.out.println("is turn ok"+game.getSeat(2).isTurn());
        
        game.playHand(2, Action.CALL, 4);
        game.playHand(3, Action.CALL, 4);
        System.out.println(game.getCommunityCards());
    }
    
    
}
