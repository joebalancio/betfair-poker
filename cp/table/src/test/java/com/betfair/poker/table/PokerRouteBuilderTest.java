package com.betfair.poker.table;
import org.testng.Assert;
import org.testng.annotations.Test;

import com.betfair.poker.player.Player;


public class PokerRouteBuilderTest {
    @Test
    public void readTableTest() throws Exception {
        PokerRouteBuilder prb = new PokerRouteBuilder();
        Table table = new Table();
        prb.setTable(table);
        String json = prb.readTable();
        Assert.assertNotNull(json);
        System.out.println("##### table=\n" + json);
        //Assert.assertEquals("Heart", card.getSuit());
    }
    
    @Test
    public void readPlayersTest() throws Exception {
        PokerRouteBuilder prb = new PokerRouteBuilder();
        Table table = new Table();
        prb.setTable(table);
        
        Player player1 = new Player("joe", 1);
        table.addPlayer(player1, 0);
        Player player2 = new Player("blow", 2);
        table.addPlayer(player2, 2);
        table.setSeatDealer();
        String json = prb.readPlayers();
        Assert.assertNotNull(json);
        System.out.println("##### players=\n" + json);
        //Assert.assertEquals("Heart", card.getSuit());
    }
}
