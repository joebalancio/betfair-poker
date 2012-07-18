package com.betfair.poker.deck;

public enum SuitEnum {
    CLUB("Club"), 
    DIAMOND("Diamond"), 
    HEART("Heart"), 
    SPADE("Spade");

    private final String value;

    SuitEnum(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static SuitEnum fromValue(String v) {
        for (SuitEnum c: SuitEnum.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v.toString());
    }
}