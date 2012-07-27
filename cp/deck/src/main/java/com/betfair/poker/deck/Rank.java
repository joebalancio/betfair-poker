package com.betfair.poker.deck;

public enum Rank {
    TWO("2", 0), 
    THREE("3", 1),
    FOUR("4", 2),
    FIVE("5", 3),
    SIX("6", 4),
    SEVEN("7", 5),
    EIGHT("8", 6),
    NINE("9", 7),
    TEN("10", 8),
    JACK("Jack", 9),
    QUEEN("Queen", 10),
    KING("King", 11),
    ACE("Ace", 12);
    
    private final int rank;
    private final String value;

    Rank(final String value, final int rank) {
        this.value = value;
        this.rank = rank;
    }

    public String getValue() {
        return value;
    }
    public int getRank() {
    	return rank;
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