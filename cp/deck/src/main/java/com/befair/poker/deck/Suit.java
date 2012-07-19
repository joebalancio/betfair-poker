package com.betfair.poker.deck;

public enum Suit {
    CLUB("Club"), 
    DIAMOND("Diamond"), 
    HEART("Heart"), 
    SPADE("Spade");

    private final String value;

    Suit(final String v) {
        this.value = v;
    }

    public String getValue() {
        return value;
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