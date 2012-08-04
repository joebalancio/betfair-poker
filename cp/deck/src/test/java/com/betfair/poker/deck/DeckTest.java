package com.betfair.poker.deck;

import java.util.ArrayList;
import java.util.Random;

import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class DeckTest {
    private ArrayList<Card> cards;

    @BeforeClass
    private void init() {
       this.cards = new ArrayList<Card>();
        
        for (Suit suit : Suit.values()) {
            for (Rank rank : Rank.values()) {
                cards.add(new Card(rank, suit));
            }
        }
    }

    private Deck newDeck() {
        return new Deck(new ArrayList<Card>(cards), new Random());
    }

    @Test
    public void dealCardTest() throws Exception {
        Deck deck = newDeck();
        Assert.assertNotNull(deck);
        Card card = deck.dealCard();
        Assert.assertNotNull(card);
        Assert.assertEquals("Card[suit:Club, rank:2]", card.toString());

        card = deck.dealCard();
        Assert.assertNotNull(card);
        Assert.assertEquals("Card[suit:Club, rank:3]", card.toString());

        card = deck.dealCard();
        Assert.assertNotNull(card);
        Assert.assertEquals("Card[suit:Club, rank:4]", card.toString());
    }

    @Test
    public void cardsDealtTest() throws Exception {
        Deck deck = newDeck();
        Assert.assertNotNull(deck);
        Card card = deck.dealCard();
        card = deck.dealCard();
        card = deck.dealCard();
        card = deck.dealCard();
        card = deck.dealCard();

        Assert.assertEquals(5, deck.getNumberOfCardsDealt());
    }

    @Test
    public void cardsRemainingTest() throws Exception {
        Deck deck = newDeck();
        Assert.assertNotNull(deck);
        Card card = deck.dealCard();
        card = deck.dealCard();
        card = deck.dealCard();
        card = deck.dealCard();
        card = deck.dealCard();

        Assert.assertEquals(47, deck.getNumberOfCardsRemaining());
    }

    // XXX: There is a small chance this could fail periodically.
    // It might make sense to use TestNG and an acceptable success rate for this
    // test.
    @Test
    public void shuffleTest() throws Exception {
        Deck deck = newDeck();
        Assert.assertNotNull(deck);
        deck.shuffle();

        Card card = deck.dealCard();
        Assert.assertNotNull(card);
        Assert.assertFalse("Card[suit:Club, rank:2]".equals(card.toString()));

        card = deck.dealCard();
        Assert.assertNotNull(card);
        Assert.assertFalse("Card[suit:Club, rank:3]".equals(card.toString()));

        card = deck.dealCard();
        Assert.assertNotNull(card);
        Assert.assertFalse("Card[suit:Club, rank:4]".equals(card.toString()));
    }

    @Test
    public void toStringTest() throws Exception {
        Deck deck = newDeck();
        Assert.assertNotNull(deck);
        Assert.assertEquals(
                "Deck[Card[suit:Club, rank:2], Card[suit:Club, rank:3], Card[suit:Club, rank:4], Card[suit:Club, rank:5], Card[suit:Club, rank:6], Card[suit:Club, rank:7], Card[suit:Club, rank:8], Card[suit:Club, rank:9], Card[suit:Club, rank:10], Card[suit:Club, rank:Jack], Card[suit:Club, rank:Queen], Card[suit:Club, rank:King], Card[suit:Club, rank:Ace], Card[suit:Diamond, rank:2], Card[suit:Diamond, rank:3], Card[suit:Diamond, rank:4], Card[suit:Diamond, rank:5], Card[suit:Diamond, rank:6], Card[suit:Diamond, rank:7], Card[suit:Diamond, rank:8], Card[suit:Diamond, rank:9], Card[suit:Diamond, rank:10], Card[suit:Diamond, rank:Jack], Card[suit:Diamond, rank:Queen], Card[suit:Diamond, rank:King], Card[suit:Diamond, rank:Ace], Card[suit:Heart, rank:2], Card[suit:Heart, rank:3], Card[suit:Heart, rank:4], Card[suit:Heart, rank:5], Card[suit:Heart, rank:6], Card[suit:Heart, rank:7], Card[suit:Heart, rank:8], Card[suit:Heart, rank:9], Card[suit:Heart, rank:10], Card[suit:Heart, rank:Jack], Card[suit:Heart, rank:Queen], Card[suit:Heart, rank:King], Card[suit:Heart, rank:Ace], Card[suit:Spade, rank:2], Card[suit:Spade, rank:3], Card[suit:Spade, rank:4], Card[suit:Spade, rank:5], Card[suit:Spade, rank:6], Card[suit:Spade, rank:7], Card[suit:Spade, rank:8], Card[suit:Spade, rank:9], Card[suit:Spade, rank:10], Card[suit:Spade, rank:Jack], Card[suit:Spade, rank:Queen], Card[suit:Spade, rank:King], Card[suit:Spade, rank:Ace]]",
                deck.toString());
    }
    
}
