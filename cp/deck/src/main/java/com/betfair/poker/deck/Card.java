package com.betfair.poker.deck;

/**
 * A single card in a deck of cards.
 */
public class Card implements Comparable<Card> {

    public static final int NO_OF_RANKS = 13;

    /** The number of suits in a deck. */
    public static final int NO_OF_SUITS = 4;

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

    @Override
    public int hashCode() {
        return (rank.getRank() * NO_OF_SUITS + suit.getSuit());
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof Card) {
            return ((Card) obj).hashCode() == hashCode();
        } else {
            return false;
        }
    }

    @Override
    public int compareTo(Card card) {
        int thisValue = hashCode();
        int otherValue = card.hashCode();
        if (thisValue < otherValue) {
            return 1;
        } else if (thisValue > otherValue) {
            return -1;
        } else {
            return 0;
        }
    }
}