package com.betfair.poker.game;

import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class GameTest {
    @Test
    public void defaulConstructorTest() throws Exception {
        Game game = new Game();
        Assert.assertNotNull(game);
        //Assert.assertEquals("Heart", card.getSuit());
    }
}
