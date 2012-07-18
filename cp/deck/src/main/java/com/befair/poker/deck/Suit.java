package com.betfair.poker.deck;

public enum Suit {
    CLUB("Club"), 
    DIAMOND("Diamond"), 
    HEART("Heart"), 
    SPADE("Spade");

    private final String value;

    Suit(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static Suit fromValue(String v) {
        for (Suit c: Suit.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v.toString());
    }
}