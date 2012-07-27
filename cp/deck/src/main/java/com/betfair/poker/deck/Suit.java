package com.betfair.poker.deck;

public enum Suit { 
	DIAMOND("Diamond", 0),
    CLUB("Club", 1), 
    HEART("Heart", 2), 
    SPADE("Spade", 3);

    private final String value;
    private final int suit;

    Suit(final String v, final int suit) {
        this.value = v;
        this.suit = suit;
    }

    public String getValue() {
        return value;
    }

    public int getSuit(){
    	return suit;
    }
    
    public static Suit fromValue(final String v) {
        for (Suit c: Suit.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v.toString());
    }
}