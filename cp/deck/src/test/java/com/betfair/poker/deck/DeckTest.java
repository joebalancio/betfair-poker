package com.betfair.poker.deck;

import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.xml.XmlBeanFactory;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

public class DeckTest {
    private BeanFactory factory;

    @BeforeMethod
    public void init() {
        Resource res = new ClassPathResource("beans.xml");
        this.factory = new XmlBeanFactory(res);
    }

    @Test
    public void dealCardTest() throws Exception {
        Deck deck = (Deck) factory.getBean("deck");
        Assert.assertNotNull(deck);
        Card card = deck.dealCard();
        Assert.assertNotNull(card);
        Assert.assertEquals("Card[suit:Club, value:2]", card.toString());

        card = deck.dealCard();
        Assert.assertNotNull(card);
        Assert.assertEquals("Card[suit:Club, value:3]", card.toString());

        card = deck.dealCard();
        Assert.assertNotNull(card);
        Assert.assertEquals("Card[suit:Club, value:4]", card.toString());
    }

    @Test
    public void cardsDealtTest() throws Exception {
        Deck deck = (Deck) factory.getBean("deck");
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
        Deck deck = (Deck) factory.getBean("deck");
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
        Deck deck = (Deck) factory.getBean("deck");
        Assert.assertNotNull(deck);
        deck.shuffle();

        Card card = deck.dealCard();
        Assert.assertNotNull(card);
        Assert.assertFalse("Card[suit:Club, value:2]".equals(card.toString()));

        card = deck.dealCard();
        Assert.assertNotNull(card);
        Assert.assertFalse("Card[suit:Club, value:3]".equals(card.toString()));

        card = deck.dealCard();
        Assert.assertNotNull(card);
        Assert.assertFalse("Card[suit:Club, value:4]".equals(card.toString()));
    }

    @Test
    public void toStringTest() throws Exception {
        Deck deck = (Deck) factory.getBean("deck");
        Assert.assertNotNull(deck);
        Assert.assertEquals(
                "Deck[Card[suit:Club, value:2], Card[suit:Club, value:3], Card[suit:Club, value:4], Card[suit:Club, value:5], Card[suit:Club, value:6], Card[suit:Club, value:7], Card[suit:Club, value:8], Card[suit:Club, value:9], Card[suit:Club, value:10], Card[suit:Club, value:Jack], Card[suit:Club, value:Queen], Card[suit:Club, value:King], Card[suit:Club, value:Ace], Card[suit:Diamond, value:2], Card[suit:Diamond, value:3], Card[suit:Diamond, value:4], Card[suit:Diamond, value:5], Card[suit:Diamond, value:6], Card[suit:Diamond, value:7], Card[suit:Diamond, value:8], Card[suit:Diamond, value:9], Card[suit:Diamond, value:10], Card[suit:Diamond, value:Jack], Card[suit:Diamond, value:Queen], Card[suit:Diamond, value:King], Card[suit:Diamond, value:Ace], Card[suit:Heart, value:2], Card[suit:Heart, value:3], Card[suit:Heart, value:4], Card[suit:Heart, value:5], Card[suit:Heart, value:6], Card[suit:Heart, value:7], Card[suit:Heart, value:8], Card[suit:Heart, value:9], Card[suit:Heart, value:10], Card[suit:Heart, value:Jack], Card[suit:Heart, value:Queen], Card[suit:Heart, value:King], Card[suit:Heart, value:Ace], Card[suit:Spade, value:2], Card[suit:Spade, value:3], Card[suit:Spade, value:4], Card[suit:Spade, value:5], Card[suit:Spade, value:6], Card[suit:Spade, value:7], Card[suit:Spade, value:8], Card[suit:Spade, value:9], Card[suit:Spade, value:10], Card[suit:Spade, value:Jack], Card[suit:Spade, value:Queen], Card[suit:Spade, value:King], Card[suit:Spade, value:Ace]]",
                deck.toString());
    }
}
