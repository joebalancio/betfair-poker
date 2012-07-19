package com.betfair.poker.deck;

/**
 * A single card in a deck of cards.
 */
public class Card {
    private final Suit suit;
    private final Rank rank;

    /**
     * Create new Card instance.
     * 
     * @param rank
     *            the rank of this card.
     * 
     * @param suit
     *            the suit of this card.
     */
    public Card(final String rank, final String suit) {
        this.rank = Rank.fromValue(rank);
        this.suit = Suit.fromValue(suit);
    }

    /**
     * Create new Card instance.
     * 
     * @param rank
     *            the rank of this card.
     * 
     * @param suit
     *            the suit of this card.
     */
    public Card(final Rank rank, final Suit suit) {
        this.rank = rank;
        this.suit = suit;
    }
    
    /**
     * Return the suit of this card.
     * 
     * @return the suit of this card.
     */
    public Suit getSuit() {
        return this.suit;
    }

    /**
     * Return the rank of this card.
     * 
     * @return the rank of this card.
     */
    public Rank getRank() {
        return this.rank;
    }

    /**
     * String representation of this class.
     */
    public String toString() {
        StringBuffer buffer = new StringBuffer();
        buffer.append("Card[");
        buffer.append("suit:").append(getSuit().getValue());
        buffer.append(", ");
        buffer.append("rank:").append(getRank().getValue());
        buffer.append("]");

        return buffer.toString();
    }
}