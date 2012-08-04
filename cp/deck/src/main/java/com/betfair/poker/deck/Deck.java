package com.betfair.poker.deck;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * A deck of cards.
 * 
 * This class does not do any thread safety management. It is assumed thread
 * safety will be managed by clients of this class.
 */
public class Deck {
    private final ArrayList<Card> cards;
    private int position = 0;
    private final Random random;

    /**
     * Create a new Deck instance.
     * 
     * @param cards
     *            List of cards in this deck
     * @param random
     *            the random generator used for shuffling the deck
     */
    public Deck(final List<Card> cards, final Random random) {
        this.cards = new ArrayList<Card>(cards);
        this.random = random;
    }

    /**
     * The number of cards that have already been dealt.
     * 
     * @return cards dealt.
     */
    public int getNumberOfCardsDealt() {
        return position;
    }

    /**
     * The number cards remaining in the deck.
     * 
     * @return number of cards remaining
     */
    public int getNumberOfCardsRemaining() {
        return 52 - position;
    }

    /**
     * The position in the deck when dealing
     * 
     * @return The position in the deck when dealing.
     */
    public int getPosition() {
        return position;
    }

    /**
     * Deals a single card from the deck. Returns null if deck is empty.
     * 
     * @return the card.
     */
    public Card dealCard() {
        if (position == 51) {
            return null;
        }

        return cards.get(position++);
    }
    
    public List<Card> dealCards(int noOfCards) {
    	List<Card> dealtCards = new ArrayList<Card>();
        if (position == 51) {
            return null;
        }
        
        for (int i=0; i< noOfCards; i++) {
            dealtCards.add(cards.get(position++));
        }
        
        return dealtCards;
    }

    /**
     * Shuffles the deck of cards.
     */
    public void shuffle() {
        for (Card card : cards) {
            // generate random number index
            int rand = random.nextInt(52);

            // index of this current card
            int index = cards.indexOf(card);

            // set the current index to the card a the random index
            cards.set(index, cards.get(rand));

            // set the random index to the current card
            cards.set(rand, card);
        }

        // reset the position to 0
        this.position = 0;
    }

    public void shuffle(final int num) {
        for (int i = 0; i < num; i++) {
            shuffle();
        }
    }
    
    /**
     * String representation of this class.
     */
    @Override
    public String toString() {
        StringBuffer buffer = new StringBuffer();
        buffer.append("Deck[");

        for (Card card : cards) {
            buffer.append(card.toString());

            // do not append comma if we have reached the end of the deck.
            if (cards.lastIndexOf(card) != (cards.size() - 1)) {
                buffer.append(", ");
            }
        }

        buffer.append("]");

        return buffer.toString();
    }
}