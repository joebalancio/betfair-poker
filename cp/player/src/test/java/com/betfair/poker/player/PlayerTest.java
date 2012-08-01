package com.betfair.poker.player;

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
        Assert.assertEquals(player.getCash(), 98);

        player.act(Action.RAISE, 2, 2);
        Assert.assertEquals(player.getBet(), 4);
        Assert.assertEquals(player.getCash(), 96);

        player.act(Action.CALL, 2, 4);
        Assert.assertEquals(player.getBet(), 4);
        Assert.assertEquals(player.getCash(), 96);
    }
}
