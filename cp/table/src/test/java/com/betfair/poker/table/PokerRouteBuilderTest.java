package com.betfair.poker.table;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.testng.Assert;
import org.testng.annotations.Test;

import com.betfair.poker.player.Player;


public class PokerRouteBuilderTest {
    @Test
    public void testGamePlay() throws Exception {
        final PokerRouteBuilder prb = new PokerRouteBuilder();
        final Table table = new Table(4, 50);
        prb.setTable(table);
        
        final Map<String, Object> map = new HashMap<String, Object>();

        map.put("name", "John");
        map.put("avatar", "1.png");
        
        prb.createPlayer(map);

        map.put("name", "Jack");
        map.put("avatar", "2.png");
        
        prb.createPlayer(map);

        map.put("name", "Joe");
        map.put("avatar", "3.png");
        
        prb.createPlayer(map);
        
        map.put("name", "John");
        map.put("avatar", "4.png");
        
        prb.createPlayer(map);

        String json = prb.readTable();
        Assert.assertNotNull(json);
        System.out.println("##### table1=\n" + json);
        
        json = prb.readPlayers();
        Assert.assertNotNull(json);
        System.out.println("##### players1=\n" + json);
        
        Assert.assertTrue(prb.startGame());
        
        json = prb.readTable();
        Assert.assertNotNull(json);
        System.out.println("##### table2=\n" + json);
        
        json = prb.readPlayers();
        Assert.assertNotNull(json);
        System.out.println("##### players2=\n" + json);
    }
    
    
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
        
        Player player1 = new Player("joe");
        table.addPlayer(player1, 0);
        Player player2 = new Player("blow");
        table.addPlayer(player2, 2);
        table.setSeatDealer();
        String json = prb.readPlayers();
        Assert.assertNotNull(json);
        System.out.println("##### players=\n" + json);
        //Assert.assertEquals("Heart", card.getSuit());
    }
    
    @Test
    public void readPlayerTest() throws Exception {
        PokerRouteBuilder prb = new PokerRouteBuilder();
        Table table = new Table();
        prb.setTable(table);
        
        Player player1 = new Player("joe");
        table.addPlayer(player1, 0);
        Player player2 = new Player("blow");
        table.addPlayer(player2, 2);
        table.setSeatDealer();
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("seat", 0);
        String json = prb.readPlayer(map);
        Assert.assertNotNull(json);
        System.out.println("##### player=\n" + json);
        //Assert.assertEquals("Heart", card.getSuit());
    }
    
    @Test
    public void jsonToMapTest() throws Exception {
        PokerRouteBuilder prb = new PokerRouteBuilder();
        Table table = new Table();
        prb.setTable(table);
        
        Player player1 = new Player("joe");
        table.addPlayer(player1, 0);
        Player player2 = new Player("blow");
        table.addPlayer(player2, 2);
        table.setSeatDealer();
        Map<String, Object> inMap = new HashMap<String, Object>();
        inMap.put("seat", 0);
        String json = prb.readPlayer(inMap);
        Assert.assertNotNull(json);
        
        Map<String, Object> map = prb.jsonToMap(json);
        Assert.assertNotNull(map);
        
        final String name = (String) map.get("name");
        Assert.assertNotNull(name);
        Assert.assertEquals("player:read", name); 
        
        final List<Map<String, Object>> list = (List<Map<String, Object>>) map.get("args");
        Assert.assertNotNull(list);
        
        final Map<String, Object> data = list.get(0);
        Assert.assertNotNull(data);
        
        final Integer id = (Integer) data.get("id");
        Assert.assertNotNull(id);
        Assert.assertEquals(1, id.intValue());
        
        final Integer pos = (Integer) data.get("seat");
        Assert.assertNotNull(pos);
        Assert.assertEquals(0, pos.intValue());
    }
}
