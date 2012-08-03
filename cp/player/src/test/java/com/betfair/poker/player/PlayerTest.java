package com.betfair.poker.player;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.testng.Assert;
import org.testng.annotations.Test;

public class PlayerTest {
    @Test
    public void defaulConstructorTest() throws Exception {
        Player player = new Player("Test1", 100);
        Assert.assertNotNull(player);
        Assert.assertEquals(player.getStatus(), Status.CONTINUE);

        player.act(Action.BET, 2, 2);
        Assert.assertEquals(player.getBet(), 2);
        Assert.assertEquals(player.getCash(), 9998);

        player.act(Action.RAISE, 2, 2);
        Assert.assertEquals(player.getBet(), 4);
        Assert.assertEquals(player.getCash(), 9996);

        player.act(Action.CALL, 2, 4);
        Assert.assertEquals(player.getBet(), 4);
        Assert.assertEquals(player.getCash(), 9996);
    }
    
    @Test
    public void anothertEst() throws Exception {
        Map<String, Player> a = new HashMap<String, Player>();
        a.put("1", new Player("hello1", 1));
        a.put("2", new Player("hello2", 2));
        a.put("3", new Player("hello3", 3));
        a.put("4", new Player("hello4", 4));
        a.get("2").setCash(100);
        
        System.out.println(a.get("2").getCash());
        List<Player> test = new ArrayList<Player>();
        test.add(a.get("2"));
        
        test.get(0).setCash(100);
        
        System.out.println("is this workinf "+a.get("1").getCash());
    }
}
