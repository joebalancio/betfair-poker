package com.betfair.poker.deck;

/**
 * A single card in a deck of cards.
 */
public class Card {
    private SuitEnum suit;
    private RankEnum value;

    /**
     * Create new Card instance.
     * 
     * @param suit
     *            the suit of this card.
     * @param value
     *            the value of this card.
     */
    public Card(String suit, String value) {
        this.suit = SuitEnum.fromValue(suit);
        this.value = RankEnum.fromValue(value);
    }

    /**
     * Return the suit of this card.
     * 
     * @return the suit of this card.
     */
    public String getSuit() {
        return this.suit.value();
    }

    /**
     * Set the suit of this card.
     * 
     * @param suit
     *            the suit to set.
     */
    public void setSuit(String suit) {
        this.suit = SuitEnum.fromValue(suit);
    }

    /**
     * Return the value of this card.
     * 
     * @return the value of this card.
     */
    public String getValue() {
        return this.value.value();
    }

    /**
     * Set the value of this card.
     * 
     * @param value
     *            the value to set.
     */
    public void setValue(String value) {
        this.value = RankEnum.fromValue(value);
    }

    /**
     * String representation of this class.
     */
    public String toString() {
        StringBuffer buffer = new StringBuffer();
        buffer.append("Card[");
        buffer.append("suit:").append(getSuit());
        buffer.append(", ");
        buffer.append("value:").append(getValue());
        buffer.append("]");

        return buffer.toString();
    }
}