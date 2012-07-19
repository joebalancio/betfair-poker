package com.betfair.poker.hand;

import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class HandTest {
    @Test
    public void defaulConstructorTest() throws Exception {
        Hand hand = new Hand();
        Assert.assertNotNull(hand);
        //Assert.assertEquals("Heart", card.getSuit());
    }
}
