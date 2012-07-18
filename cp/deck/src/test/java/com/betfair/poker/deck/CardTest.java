package com.betfair.poker.deck;

import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;


import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.xml.XmlBeanFactory;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

public class CardTest {
    private BeanFactory factory;

    @BeforeClass
    public void init() {
        Resource res = new ClassPathResource("beans.xml");
        this.factory = new XmlBeanFactory(res);
    }

    @Test
    public void getSuitTest() throws Exception {
        Card card = (Card) factory.getBean("tenHeart");
        Assert.assertNotNull(card);
        Assert.assertEquals("Heart", card.getSuit());
    }

    @Test
    public void getValueTest() throws Exception {
        Card card = (Card) factory.getBean("kingClub");
        Assert.assertNotNull(card);
        Assert.assertEquals("King", card.getValue());
    }

    @Test
    public void toStringTest() throws Exception {
        Card card = (Card) factory.getBean("aceSpade");
        Assert.assertNotNull(card);
        Assert.assertEquals("Card[suit:Spade, value:Ace]", card.toString());
    }
}
