package com.betfair.poker.player;

import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import com.betfair.poker.table.Seat;

public class PlayerTest {
    @Test
    public void defaulConstructorTest() throws Exception {
    	Seat seat = new Seat(1);
        Player player = new Player("Test1",100,seat);
        Assert.assertNotNull(player);
        Assert.assertEquals(player.getStatus(), Status.CONTINUE);
        
        player.act(Status.BET, 2, 2);
        Assert.assertEquals(player.getBet(),2);
        Assert.assertEquals(player.getCash(),98);
        
        player.act(Status.RAISE, 2, 2);
        Assert.assertEquals(player.getBet(),4);
        Assert.assertEquals(player.getCash(),96);
        
        player.act(Status.CALL, 2, 4);
        Assert.assertEquals(player.getBet(),4);
        Assert.assertEquals(player.getCash(),96);
    }
}
