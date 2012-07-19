package com.betfair.poker.player;

import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class PlayerTest {
    @Test
    public void defaulConstructorTest() throws Exception {
        Player player = new Player();
        Assert.assertNotNull(player);
        //Assert.assertEquals("Heart", card.getSuit());
    }
}
