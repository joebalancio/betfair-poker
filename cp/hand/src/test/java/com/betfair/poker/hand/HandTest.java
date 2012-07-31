package com.betfair.poker.hand;

import java.util.ArrayList;
import java.util.List;

import org.testng.Assert;
import org.testng.annotations.Test;

import com.betfair.poker.deck.Card;

public class HandTest {
    @Test
    public void defaulConstructorTest() throws Exception {
        Hand hand = new Hand();
        Assert.assertNotNull(hand);
        // Assert.assertEquals("Heart", card.getSuit());
    }

    @Test
    public void highCard() {
        HandEvaluator evaluator = null;
        int value1, value2;

        // Base hand.
        Card ace = new Card("Ace", "Spade");
        Card queen = new Card("Queen", "Heart");
        Card ten = new Card("10", "Club");
        Card eight = new Card("8", "Diamond");
        Card fived = new Card("5", "Diamond");
        Card fourh = new Card("4", "Heart");
        Card twoc = new Card("2", "Club");
        CommunityCards cCards = new CommunityCards();
        cCards.add(ace);
        cCards.add(queen);
        cCards.add(ten);
        cCards.add(eight);
        cCards.add(fived);
        Hand hand = new Hand();
        hand.setCommunityCards(cCards);
        hand.addCard(fourh);
        hand.addCard(twoc);
        Assert.assertEquals(HandType.HIGH_CARD, hand.getHandType());
        value1 = hand.getHandValue();

        // Different suits.
        // evaluator = new HandEvaluator(new Hand("Ac Qd Td 8h 5s 4c 2d"));
        Card one = new Card("Ace", "Club");
        Card two = new Card("Queen", "Diamond");
        Card three = new Card("10", "Diamond");
        Card four = new Card("8", "Heart");
        Card five = new Card("5", "Spade");
        Card six = new Card("4", "Club");
        Card seven = new Card("2", "Diamond");
        CommunityCards cCards2 = new CommunityCards();
        cCards2.add(one);
        cCards2.add(two);
        cCards2.add(three);
        cCards2.add(four);
        cCards2.add(five);
        Hand hand2 = new Hand();
        hand2.setCommunityCards(cCards2);
        hand2.addCard(six);
        hand2.addCard(seven);

        Assert.assertEquals(HandType.HIGH_CARD, hand2.getHandType());
        value2 = hand2.getHandValue();
        Assert.assertTrue(value1 == value2);

        // Major rank.
        // evaluator = new HandEvaluator(new Hand("Ks Qh Tc 8d 5d 4h 2c"));
        Card one1 = new Card("King", "Spade");
        Card two1 = new Card("Queen", "Heart");
        Card three1 = new Card("10", "Club");
        Card four1 = new Card("8", "Diamond");
        Card five1 = new Card("5", "Diamond");
        Card six1 = new Card("4", "Heart");
        Card seven1 = new Card("2", "Club");
        CommunityCards cCards3 = new CommunityCards();
        cCards3.add(one1);
        cCards3.add(two1);
        cCards3.add(three1);
        cCards3.add(four1);
        cCards3.add(five1);
        Hand hand3 = new Hand();
        hand3.setCommunityCards(cCards3);
        hand3.addCard(six1);
        hand3.addCard(seven1);

        Assert.assertEquals(HandType.HIGH_CARD, hand3.getHandType());
        value2 = hand3.getHandValue();
        Assert.assertTrue(value1 > value2);

        // Minor rank.
        // evaluator = new HandEvaluator(new Hand("Ks Qh Tc 8d 4d 3h 2c"));
        Card one4 = new Card("King", "Spade");
        Card two4 = new Card("Queen", "Heart");
        Card three4 = new Card("10", "Club");
        Card four4 = new Card("8", "Diamond");
        Card five4 = new Card("4", "Diamond");
        Card six4 = new Card("3", "Heart");
        Card seven4 = new Card("2", "Club");
        CommunityCards cCards4 = new CommunityCards();
        cCards4.add(one4);
        cCards4.add(two4);
        cCards4.add(three4);
        cCards4.add(four4);
        cCards4.add(five4);
        Hand hand4 = new Hand();
        hand4.setCommunityCards(cCards4);
        hand4.addCard(six4);
        hand4.addCard(seven4);

        Assert.assertEquals(HandType.HIGH_CARD, hand4.getHandType());
        value2 = hand4.getHandValue();
        Assert.assertTrue(value1 > value2);

        // Discarded cards (more than 5).
        // evaluator = new HandEvaluator(new Hand("As Qh Tc 8d 5d 4h 3c"));
        Card one5 = new Card("Ace", "Spade");
        Card two5 = new Card("Queen", "Heart");
        Card three5 = new Card("10", "Club");
        Card four5 = new Card("8", "Diamond");
        Card five5 = new Card("5", "Diamond");
        Card six5 = new Card("4", "Heart");
        Card seven5 = new Card("3", "Club");
        List<Card> cards = new ArrayList<Card>();
        cards.add(one5);
        cards.add(two5);
        cards.add(three5);
        cards.add(four5);
        cards.add(five5);
        cards.add(six5);
        cards.add(seven5);
        Hand hand5 = this.getHand(cards);

        Assert.assertEquals(HandType.HIGH_CARD, hand5.getHandType());
        value2 = hand5.getHandValue();
        Assert.assertTrue(value1 == value2);
    }

    private Hand getHand(List<Card> cards) {
        CommunityCards cCards = new CommunityCards();
        for (int i = 0; i < 5; i++) {
            Card card = cards.get(i);
            cCards.add(card);
        }
        Hand hand = new Hand();
        hand.setCommunityCards(cCards);
        for (int i = 5; i < cards.size(); i++) {
            Card card = cards.get(i);
            hand.addCard(card);
        }
        return hand;
    }

    /**
     * Tests the One Pair hand type.
     */
    @Test
    public void onePair() {
        HandEvaluator evaluator = null;
        int value1, value2;

        // Base hand.
        // evaluator = new HandEvaluator(new Hand("Qs Qh 9c 7c 5d 3s 2h"));
        Card one = new Card("Queen", "Spade");
        Card two = new Card("Queen", "Heart");
        Card three = new Card("9", "Club");
        Card four = new Card("7", "Club");
        Card five = new Card("5", "Diamond");
        Card six = new Card("3", "Spade");
        Card seven = new Card("2", "Heart");
        List<Card> cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        Hand hand = this.getHand(cards);

        Assert.assertEquals(HandType.ONE_PAIR, hand.getHandType());
        value1 = hand.getHandValue();

        // Rank.
        // evaluator = new HandEvaluator(new Hand("Js Jh 9c 7c 5d 3s 2h"));
        one = new Card("Jack", "Spade");
        two = new Card("Jack", "Heart");
        three = new Card("9", "Club");
        four = new Card("7", "Club");
        five = new Card("5", "Diamond");
        six = new Card("3", "Spade");
        seven = new Card("2", "Heart");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.ONE_PAIR, hand.getHandType());
        value2 = hand.getHandValue();
        Assert.assertTrue(value1 > value2);

        // Major kicker.
        // evaluator = new HandEvaluator(new Hand("Qs Qh 8c 7c 5d 3s 2h"));
        one = new Card("Queen", "Spade");
        two = new Card("Queen", "Heart");
        three = new Card("8", "Club");
        four = new Card("7", "Club");
        five = new Card("5", "Diamond");
        six = new Card("3", "Spade");
        seven = new Card("2", "Heart");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.ONE_PAIR, hand.getHandType());
        value2 = hand.getHandValue();
        Assert.assertTrue(value1 > value2);

        // Minor kicker.
        // evaluator = new HandEvaluator(new Hand("Qs Qh 9c 7c 4d 3s 2h"));
        one = new Card("Queen", "Spade");
        two = new Card("Queen", "Heart");
        three = new Card("9", "Club");
        four = new Card("7", "Club");
        five = new Card("4", "Diamond");
        six = new Card("3", "Spade");
        seven = new Card("2", "Heart");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.ONE_PAIR, hand.getHandType());
        value2 = hand.getHandValue();
        Assert.assertTrue(value1 > value2);

        // Discarded cards (more than 5).
        // evaluator = new HandEvaluator(new Hand("Qs Qh 9c 7c 5d 2d"));
        one = new Card("Queen", "Spade");
        two = new Card("Queen", "Heart");
        three = new Card("9", "Club");
        four = new Card("7", "Club");
        five = new Card("5", "Diamond");
        six = new Card("2", "Diamond");

        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);

        hand = this.getHand(cards);
        Assert.assertEquals(HandType.ONE_PAIR, hand.getHandType());
        value2 = hand.getHandValue();
        Assert.assertTrue(value1 == value2);
    }

    /**
     * Tests the Two Pairs hand type.
     */
    @Test
    public void twoPairs() {
        HandEvaluator evaluator = null;
        int value1, value2;

        // Base hand.
        // evaluator = new HandEvaluator(new Hand("Ks Qh Tc 5d 5c 2h 2c"));
        Card one = new Card("King", "Spade");
        Card two = new Card("Queen", "Heart");
        Card three = new Card("10", "Club");
        Card four = new Card("5", "Diamond");
        Card five = new Card("5", "Club");
        Card six = new Card("2", "Heart");
        Card seven = new Card("2", "Club");
        List<Card> cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        Hand hand = this.getHand(cards);
        Assert.assertEquals(HandType.TWO_PAIRS, hand.getHandType());
        value1 = hand.getHandValue();

        // High pair.
        // evaluator = new HandEvaluator(new Hand("Ks Qh Tc 4d 4d 2h 2c"));
        one = new Card("King", "Spade");
        two = new Card("Queen", "Heart");
        three = new Card("10", "Club");
        four = new Card("4", "Diamond");
        five = new Card("4", "Diamond");
        six = new Card("2", "Heart");
        seven = new Card("2", "Club");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.TWO_PAIRS, hand.getHandType());
        value2 = hand.getHandValue();
        Assert.assertTrue(value1 > value2);

        // Low pair.
        // evaluator = new HandEvaluator(new Hand("Ks Qh Tc 4d 4d 3h 3c"));
        one = new Card("King", "Spade");
        two = new Card("Queen", "Heart");
        three = new Card("10", "Club");
        four = new Card("4", "Diamond");
        five = new Card("4", "Diamond");
        six = new Card("3", "Heart");
        seven = new Card("3", "Club");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.TWO_PAIRS, hand.getHandType());
        value2 = hand.getHandValue();
        Assert.assertTrue(value1 > value2);

        // Major kicker.
        // evaluator = new HandEvaluator(new Hand("As Qh Tc 5d 5d 2h 2c"));
        one = new Card("Ace", "Spade");
        two = new Card("Queen", "Heart");
        three = new Card("10", "Club");
        four = new Card("5", "Diamond");
        five = new Card("5", "Diamond");
        six = new Card("2", "Heart");
        seven = new Card("2", "Club");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.TWO_PAIRS, hand.getHandType());
        value2 = hand.getHandValue();
        Assert.assertTrue(value1 < value2);

        // Discarded cards (more than 5).
        // evaluator = new HandEvaluator(new Hand("Ks Jh Tc 5d 5d 2h 2c"));
        one = new Card("King", "Spade");
        two = new Card("Jack", "Heart");
        three = new Card("10", "Club");
        four = new Card("5", "Diamond");
        five = new Card("5", "Diamond");
        six = new Card("2", "Heart");
        seven = new Card("2", "Club");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.TWO_PAIRS, hand.getHandType());
        value2 = hand.getHandValue();
        Assert.assertTrue(value1 == value2);
    }

    /**
     * Tests the Three of a Kind hand type.
     */
    @Test
    public void threeOfAKind() {
        HandEvaluator evaluator = null;
        int value1, value2;

        // Base hand.
        // evaluator = new HandEvaluator(new Hand("Ah Qs Qh Qc Th 8s 6c"));
        Card one = new Card("Ace", "Heart");
        Card two = new Card("Queen", "Spade");
        Card three = new Card("Queen", "Heart");
        Card four = new Card("Queen", "Club");
        Card five = new Card("10", "Heart");
        Card six = new Card("8", "Spade");
        Card seven = new Card("6", "Club");
        List<Card> cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        Hand hand = this.getHand(cards);
        Assert.assertEquals(HandType.THREE_OF_A_KIND, hand.getHandType());
        value1 = hand.getHandValue();

        // Rank.
        // evaluator = new HandEvaluator(new Hand("Ah Js Jh Jc Th 8s 6c"));
        one = new Card("Ace", "Heart");
        two = new Card("Jack", "Spade");
        three = new Card("Jack", "Heart");
        four = new Card("Jack", "Club");
        five = new Card("10", "Heart");
        six = new Card("8", "Spade");
        seven = new Card("6", "Club");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.THREE_OF_A_KIND, hand.getHandType());
        value2 = hand.getHandValue();
        Assert.assertTrue(value1 > value2);

        // Major kicker.
        // evaluator = new HandEvaluator(new Hand("Ks Qs Qh Qc Th 8s 6c"));
        one = new Card("King", "Spade");
        two = new Card("Queen", "Spade");
        three = new Card("Queen", "Heart");
        four = new Card("Queen", "Club");
        five = new Card("10", "Heart");
        six = new Card("8", "Spade");
        seven = new Card("6", "Club");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.THREE_OF_A_KIND, hand.getHandType());
        value2 = hand.getHandValue();
        Assert.assertTrue(value1 > value2);

        // Minor kicker.
        // evaluator = new HandEvaluator(new Hand("As Qs Qh Qc 9h 8s 6c"));
        one = new Card("Ace", "Spade");
        two = new Card("Queen", "Spade");
        three = new Card("Queen", "Heart");
        four = new Card("Queen", "Club");
        five = new Card("9", "Heart");
        six = new Card("8", "Spade");
        seven = new Card("6", "Club");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.THREE_OF_A_KIND, hand.getHandType());
        value2 = hand.getHandValue();
        Assert.assertTrue(value1 > value2);

        // Discarded cards (more than 5).
        // evaluator = new HandEvaluator(new Hand("As Qs Qh Qc Th 7s 6c"));
        one = new Card("Ace", "Spade");
        two = new Card("Queen", "Spade");
        three = new Card("Queen", "Heart");
        four = new Card("Queen", "Club");
        five = new Card("10", "Heart");
        six = new Card("7", "Spade");
        seven = new Card("6", "Club");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.THREE_OF_A_KIND, hand.getHandType());
        value2 = hand.getHandValue();
        Assert.assertTrue(value1 == value2);
    }

    /**
     * Tests the Straight hand type.
     */
    @Test
    public void straight() {
        HandEvaluator evaluator = null;
        int value1, value2;

        // Base hand.
        // evaluator = new HandEvaluator(new Hand("Ks Th 9s 8d 7c 6h 4c"));
        Card one = new Card("King", "Spade");
        Card two = new Card("10", "Heart");
        Card three = new Card("9", "Spade");
        Card four = new Card("8", "Diamond");
        Card five = new Card("7", "Club");
        Card six = new Card("6", "Heart");
        Card seven = new Card("4", "Club");
        List<Card> cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        Hand hand = this.getHand(cards);
        Assert.assertEquals(HandType.STRAIGHT, hand.getHandType());
        value1 = hand.getHandValue();

        // Broadway (Ace-high Straight).
        // evaluator = new HandEvaluator(new Hand("As Ks Qs Js Th 4d 2c"));
        one = new Card("Ace", "Spade");
        two = new Card("King", "Spade");
        three = new Card("Queen", "Spade");
        four = new Card("Jack", "Spade");
        five = new Card("10", "Heart");
        six = new Card("4", "Diamond");
        seven = new Card("2", "Club");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.STRAIGHT, hand.getHandType());
        value2 = hand.getHandValue();
        Assert.assertTrue(value2 > value1);

        // Different suit (tie).
        // evaluator = new HandEvaluator(new Hand("Ks Tc 9d 8h 7d 6s 4c"));
        one = new Card("King", "Spade");
        two = new Card("10", "Club");
        three = new Card("9", "Diamond");
        four = new Card("8", "Heart");
        five = new Card("7", "Diamond");
        six = new Card("6", "Spade");
        seven = new Card("4", "Club");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.STRAIGHT, hand.getHandType());
        value2 = hand.getHandValue();
        Assert.assertTrue(value1 == value2);

        // Rank.
        // evaluator = new HandEvaluator(new Hand("Ks 9d 8h 7d 6s 5c 2d"));
        one = new Card("King", "Spade");
        two = new Card("9", "Diamond");
        three = new Card("8", "Heart");
        four = new Card("7", "Diamond");
        five = new Card("6", "Spade");
        six = new Card("5", "Club");
        seven = new Card("2", "Diamond");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.STRAIGHT, hand.getHandType());
        value2 = hand.getHandValue();
        Assert.assertTrue(value1 > value2);

        // Discarded cards (more than 5).
        // evaluator = new HandEvaluator(new Hand("As Th 9s 8d 7c 6h 4c"));
        one = new Card("King", "Spade");
        two = new Card("10", "Heart");
        three = new Card("9", "Spade");
        four = new Card("8", "Diamond");
        five = new Card("7", "Club");
        six = new Card("6", "Heart");
        seven = new Card("4", "Club");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.STRAIGHT, hand.getHandType());
        value2 = hand.getHandValue();
        Assert.assertTrue(value1 == value2);

        // Wheel (5-high Straight with wheeling Ace).
        // evaluator = new HandEvaluator(new Hand("Ad Qc Th 5s 4d 3h 2c"));
        one = new Card("Ace", "Diamond");
        two = new Card("Queen", "Club");
        three = new Card("10", "Heart");
        four = new Card("5", "Spade");
        five = new Card("4", "Diamond");
        six = new Card("3", "Heart");
        seven = new Card("2", "Club");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.STRAIGHT, hand.getHandType());
    }

    /**
     * Tests the Flush hand type.
     */
    @Test
    public void flush() {
        HandEvaluator evaluator = null;
        int value1, value2;

        // Base hand.
        // evaluator = new HandEvaluator(new Hand("As Qs Ts 8s 6s 4d 2c"));
        Card one = new Card("Ace", "Spade");
        Card two = new Card("Queen", "Spade");
        Card three = new Card("10", "Spade");
        Card four = new Card("8", "Spade");
        Card five = new Card("6", "Spade");
        Card six = new Card("4", "Diamond");
        Card seven = new Card("2", "Club");
        List<Card> cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        Hand hand = this.getHand(cards);
        Assert.assertEquals(HandType.FLUSH, hand.getHandType());
        value1 = hand.getHandValue();

        // Different suit (tie).
        // evaluator = new HandEvaluator(new Hand("Ad Qd Td 8d 6d 4c 2h"));
        one = new Card("Ace", "Diamond");
        two = new Card("Queen", "Diamond");
        three = new Card("10", "Diamond");
        four = new Card("8", "Diamond");
        five = new Card("6", "Diamond");
        six = new Card("4", "Club");
        seven = new Card("2", "Heart");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.FLUSH, hand.getHandType());
        value2 = hand.getHandValue();
        Assert.assertTrue(value1 == value2);

        // Missing one.
        // evaluator = new HandEvaluator(new Hand("Kh Jh Jd 8h 6d 5s 3h"));
        one = new Card("King", "Heart");
        two = new Card("Jack", "Heart");
        three = new Card("Jack", "Diamond");
        four = new Card("8", "Heart");
        five = new Card("6", "Diamond");
        six = new Card("5", "Spade");
        seven = new Card("3", "Heart");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertFalse(hand.getHandType() == HandType.FLUSH);
        value2 = hand.getHandValue();
        Assert.assertTrue(value1 > value2);

        // Major rank.
        // evaluator = new HandEvaluator(new Hand("Ks Qs Ts 8s 6s 4d 2c"));
        one = new Card("King", "Spade");
        two = new Card("Queen", "Spade");
        three = new Card("10", "Spade");
        four = new Card("8", "Spade");
        five = new Card("6", "Spade");
        six = new Card("4", "Diamond");
        seven = new Card("2", "Club");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.FLUSH, hand.getHandType());
        value2 = hand.getHandValue();
        Assert.assertTrue(value1 > value2);

        // Minor rank.
        // evaluator = new HandEvaluator(new Hand("As Qs Ts 8s 5s 4d 2c"));
        one = new Card("King", "Spade");
        two = new Card("Queen", "Spade");
        three = new Card("10", "Spade");
        four = new Card("8", "Spade");
        five = new Card("5", "Spade");
        six = new Card("4", "Diamond");
        seven = new Card("2", "Club");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.FLUSH, hand.getHandType());
        value2 = hand.getHandValue();
        Assert.assertTrue(value1 > value2);

        // Discarded cards (more than 5).
        // evaluator = new HandEvaluator(new Hand("As Qs Ts 8s 6s 5s 2s"));
        one = new Card("Ace", "Spade");
        two = new Card("Queen", "Spade");
        three = new Card("10", "Spade");
        four = new Card("8", "Spade");
        five = new Card("6", "Spade");
        six = new Card("5", "Spade");
        seven = new Card("2", "Spade");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.FLUSH, hand.getHandType());
        value2 = hand.getHandValue();
        Assert.assertTrue(value1 == value2);
    }

    /**
     * Tests the Full House hand type.
     */
    @Test
    public void fullHouse() {
        HandEvaluator evaluator = null;
        int value1, value2;

        // Base hand.
        // evaluator = new HandEvaluator(new Hand("As Qs Qh Qc Tc Td 4c"));
        Card one = new Card("Ace", "Spade");
        Card two = new Card("Queen", "Spade");
        Card three = new Card("Queen", "Heart");
        Card four = new Card("Queen", "Club");
        Card five = new Card("10", "Club");
        Card six = new Card("10", "Diamond");
        Card seven = new Card("4", "Club");
        List<Card> cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        Hand hand = this.getHand(cards);
        Assert.assertEquals(HandType.FULL_HOUSE, hand.getHandType());
        value1 = hand.getHandValue();

        // Triple.
        // evaluator = new HandEvaluator(new Hand("As Js Jh Jc Tc Td 4c"));
        one = new Card("Ace", "Spade");
        two = new Card("Jack", "Spade");
        three = new Card("Jack", "Heart");
        four = new Card("Jack", "Club");
        five = new Card("10", "Club");
        six = new Card("10", "Diamond");
        seven = new Card("4", "Club");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.FULL_HOUSE, hand.getHandType());
        value2 = hand.getHandValue();
        Assert.assertTrue(value1 > value2);

        // Pair.
        // evaluator = new HandEvaluator(new Hand("As Qs Qh Qc 9c 9d 4c"));
        one = new Card("Ace", "Spade");
        two = new Card("Queen", "Spade");
        three = new Card("Queen", "Heart");
        four = new Card("Queen", "Club");
        five = new Card("9", "Club");
        six = new Card("9", "Diamond");
        seven = new Card("4", "Club");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.FULL_HOUSE, hand.getHandType());
        value2 = hand.getHandValue();
        Assert.assertTrue(value1 > value2);

        // Triple over pair.
        // evaluator = new HandEvaluator(new Hand("As Js Jh Jc Kc Kd 4c"));
        one = new Card("Ace", "Spade");
        two = new Card("Jack", "Spade");
        three = new Card("Jack", "Heart");
        four = new Card("Jack", "Club");
        five = new Card("King", "Club");
        six = new Card("King", "Diamond");
        seven = new Card("4", "Club");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.FULL_HOUSE, hand.getHandType());
        value2 = hand.getHandValue();
        Assert.assertTrue(value1 > value2);

        // Discarded cards (more than 5).
        // evaluator = new HandEvaluator(new Hand("Ks Qs Qh Qc Tc Td 4c"));
        one = new Card("King", "Spade");
        two = new Card("Queen", "Spade");
        three = new Card("Queen", "Heart");
        four = new Card("Queen", "Club");
        five = new Card("10", "Club");
        six = new Card("10", "Diamond");
        seven = new Card("4", "Club");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.FULL_HOUSE, hand.getHandType());
        value2 = hand.getHandValue();
        Assert.assertTrue(value1 == value2);
    }

    /**
     * Tests the Four of a Kind hand type.
     */
    @Test
    public void fourOfAKind() {
        HandEvaluator evaluator = null;
        int value1, value2;

        // Base hand.
        // evaluator = new HandEvaluator(new Hand("As Ah Ac Ad Qs Th 8c"));
        Card one = new Card("Ace", "Spade");
        Card two = new Card("Ace", "Heart");
        Card three = new Card("Ace", "Club");
        Card four = new Card("Ace", "Diamond");
        Card five = new Card("Queen", "Spade");
        Card six = new Card("10", "Heart");
        Card seven = new Card("8", "Club");
        List<Card> cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        Hand hand = this.getHand(cards);
        Assert.assertEquals(HandType.FOUR_OF_A_KIND, hand.getHandType());
        value1 = hand.getHandValue();

        // Rank.
        // evaluator = new HandEvaluator(new Hand("Ks Kh Kc Kd Qs Th 8c"));
        one = new Card("King", "Spade");
        two = new Card("King", "Heart");
        three = new Card("King", "Club");
        four = new Card("King", "Diamond");
        five = new Card("Queen", "Club");
        six = new Card("10", "Heart");
        seven = new Card("8", "Club");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.FOUR_OF_A_KIND, hand.getHandType());
        value2 = hand.getHandValue();
        Assert.assertTrue(value1 > value2);

        // Kicker.
        // evaluator = new HandEvaluator(new Hand("As Ah Ac Ad Js Th 8c"));
        one = new Card("Ace", "Spade");
        two = new Card("Ace", "Heart");
        three = new Card("Ace", "Club");
        four = new Card("Ace", "Diamond");
        five = new Card("Jack", "Spade");
        six = new Card("10", "Heart");
        seven = new Card("8", "Club");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.FOUR_OF_A_KIND, hand.getHandType());
        value2 = hand.getHandValue();
        Assert.assertTrue(value1 > value2);

        // Discarded cards (more than 5).
        // evaluator = new HandEvaluator(new Hand("As Ah Ac Ad Qs 3d 2c"));
        one = new Card("Ace", "Spade");
        two = new Card("Ace", "Heart");
        three = new Card("Ace", "Club");
        four = new Card("Ace", "Diamond");
        five = new Card("Queen", "Spade");
        six = new Card("3", "Diamond");
        seven = new Card("2", "Club");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.FOUR_OF_A_KIND, hand.getHandType());
        value2 = hand.getHandValue();
        Assert.assertTrue(value1 == value2);
    }

    /**
     * Tests the Straight Flush hand type.
     */
    @Test
    public void straightFlush() {
        HandEvaluator evaluator = null;
        int value1, value2;

        // Base hand.
        // evaluator = new HandEvaluator(new Hand("Ks Qs Js Ts 9s 4d 2c"));
        Card one = new Card("King", "Spade");
        Card two = new Card("Queen", "Spade");
        Card three = new Card("Jack", "Spade");
        Card four = new Card("10", "Spade");
        Card five = new Card("9", "Spade");
        Card six = new Card("4", "Diamond");
        Card seven = new Card("2", "Club");
        List<Card> cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        Hand hand = this.getHand(cards);
        Assert.assertEquals(HandType.STRAIGHT_FLUSH, hand.getHandType());
        value1 = hand.getHandValue();

        // Rank.
        // evaluator = new HandEvaluator(new Hand("Qh Jh Th 9h 8h 4d 2c"));
        one = new Card("Queen", "Heart");
        two = new Card("Jack", "Heart");
        three = new Card("10", "Heart");
        four = new Card("9", "Heart");
        five = new Card("8", "Heart");
        six = new Card("4", "Diamond");
        seven = new Card("2", "Club");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.STRAIGHT_FLUSH, hand.getHandType());
        value2 = hand.getHandValue();
        Assert.assertTrue(value1 > value2);

        // Discarded cards (more than 5).
        // evaluator = new HandEvaluator(new Hand("Ks Qs Js Ts 9s 3d 2c"));
        one = new Card("King", "Spade");
        two = new Card("Queen", "Spade");
        three = new Card("Jack", "Spade");
        four = new Card("10", "Spade");
        five = new Card("9", "Spade");
        six = new Card("3", "Diamond");
        seven = new Card("2", "Club");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.STRAIGHT_FLUSH, hand.getHandType());
        value2 = hand.getHandValue();
        Assert.assertTrue(value1 == value2);

        // Steel Wheel (5-high Straight Flush with wheeling Ace).
        // evaluator = new HandEvaluator(new Hand("As Qc Td 5s 4s 3s 2s"));
        one = new Card("Ace", "Spade");
        two = new Card("Queen", "Club");
        three = new Card("10", "Diamond");
        four = new Card("5", "Spade");
        five = new Card("4", "Spade");
        six = new Card("3", "Spade");
        seven = new Card("2", "Spade");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.STRAIGHT_FLUSH, hand.getHandType());

        // Wheel (5-high Straight with wheeling Ace), but no Steel Wheel.
        // evaluator = new HandEvaluator(new Hand("Ah Qc Td 5s 4s 3s 2s"));
        one = new Card("Ace", "Heart");
        two = new Card("Queen", "Club");
        three = new Card("10", "Diamond");
        four = new Card("5", "Spade");
        five = new Card("4", "Spade");
        six = new Card("3", "Spade");
        seven = new Card("2", "Spade");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.STRAIGHT, hand.getHandType());

        // Separate Flush and Straight (but no Straight Flush).
        // evaluator = new HandEvaluator(new Hand("Kh Qs Jh Th 9h 4h 2c"));
        one = new Card("King", "Heart");
        two = new Card("Queen", "Spade");
        three = new Card("Jack", "Heart");
        four = new Card("10", "Heart");
        five = new Card("9", "Heart");
        six = new Card("4", "Heart");
        seven = new Card("2", "Club");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.FLUSH, hand.getHandType());
    }

    /**
     * Tests the Royal Flush hand type.
     */
    @Test
    public void royalFlush() {
        HandEvaluator evaluator = null;
        int value1, value2;

        // Base hand.
        // evaluator = new HandEvaluator(new Hand("As Ks Qs Js Ts 4d 2c"));
        Card one = new Card("Ace", "Spade");
        Card two = new Card("King", "Spade");
        Card three = new Card("Queen", "Spade");
        Card four = new Card("Jack", "Spade");
        Card five = new Card("10", "Spade");
        Card six = new Card("4", "Diamond");
        Card seven = new Card("2", "Club");
        List<Card> cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        Hand hand = this.getHand(cards);
        Assert.assertEquals(HandType.ROYAL_FLUSH, hand.getHandType());
        value1 = hand.getHandValue();

        // Discarded cards (more than 5).
        // evaluator = new HandEvaluator(new Hand("As Ks Qs Js Ts 3d 2c"));
        one = new Card("Ace", "Spade");
        two = new Card("King", "Spade");
        three = new Card("Queen", "Spade");
        four = new Card("Jack", "Spade");
        five = new Card("10", "Spade");
        six = new Card("3", "Diamond");
        seven = new Card("2", "Club");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.ROYAL_FLUSH, hand.getHandType());
        value2 = hand.getHandValue();
        Assert.assertTrue(value1 == value2);

        // Separate Flush and Straight, but no Straight Flush or Royal Flush.
        // evaluator = new HandEvaluator(new Hand("As Kh Qs Js Ts 4s 2c"));
        one = new Card("Ace", "Spade");
        two = new Card("King", "Heart");
        three = new Card("Queen", "Spade");
        four = new Card("Jack", "Spade");
        five = new Card("10", "Spade");
        six = new Card("4", "Spade");
        seven = new Card("2", "Club");
        cards = new ArrayList<Card>();
        cards.add(one);
        cards.add(two);
        cards.add(three);
        cards.add(four);
        cards.add(five);
        cards.add(six);
        cards.add(seven);
        hand = this.getHand(cards);
        Assert.assertEquals(HandType.FLUSH, hand.getHandType());
    }
}
