package com.betfair.poker.pot;

import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class PotTest {
    @Test
    public void defaulConstructorTest() throws Exception {
        Pot pot = new Pot();
        Assert.assertNotNull(pot);
        //Assert.assertEquals("Heart", card.getSuit());
    }
}
