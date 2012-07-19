package com.betfair.poker.deck;

import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class CardTest {
    @Test
    public void getSuitTest() throws Exception {
        Card card = new Card("King", "Heart");
        Assert.assertNotNull(card);
        Assert.assertEquals("Heart", card.getSuit().getValue());
    }

    @Test
    public void getRankTest() throws Exception {
        Card card = new Card("King", "Heart");
        Assert.assertNotNull(card);
        Assert.assertEquals("King", card.getRank().getValue());
    }

    @Test
    public void toStringTest() throws Exception {
        Card card = new Card("Ace", "Spade");
        Assert.assertNotNull(card);
        Assert.assertEquals("Card[suit:Spade, rank:Ace]", card.toString());
    }
}
