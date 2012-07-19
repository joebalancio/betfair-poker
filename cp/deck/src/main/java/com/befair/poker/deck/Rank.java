package com.betfair.poker.deck;

public enum Rank {
    TWO("2"), 
    THREE("3"),
    FOUR("4"),
    FIVE("5"),
    SIX("6"),
    SEVEN("7"),
    EIGHT("8"),
    NINE("9"),
    TEN("10"),
    JACK("Jack"),
    QUEEN("Queen"),
    KING("King"),
    ACE("Ace");
    
    private final String value;

    Rank(final String v) {
        this.value = v;
    }

    public String getValue() {
        return value;
    }

    public static Rank fromValue(final String v) {
        for (Rank c: Rank.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v.toString());
    }
}