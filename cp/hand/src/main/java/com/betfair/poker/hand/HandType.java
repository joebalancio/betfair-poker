package com.betfair.poker.hand;

public enum HandType {
    ROYAL_FLUSH("Royal Flush", 9), STRAIGHT_FLUSH("Straight Flush", 8), FOUR_OF_A_KIND(
            "Four of a Kind", 7), FULL_HOUSE("Full House", 6), FLUSH("Flush", 5), STRAIGHT(
            "Straight", 4), THREE_OF_A_KIND("Three of a Kind", 3), TWO_PAIRS(
            "Two Pair", 2), ONE_PAIR("One Pair", 1), HIGH_CARD("High Card", 0);

    private Integer num;
    private final String value;

    HandType(final String v, final Integer num) {
        this.value = v;
        this.num = num;
    }

    public Integer getIntegerValue() {
        return num;
    }

    public String getValue() {
        return value;
    }

    public static HandType fromValue(final String v) {
        for (HandType c : HandType.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v.toString());
    }

    public static HandType fromValue(final Integer num) {
        for (HandType c : HandType.values()) {
            if (c.num.equals(num)) {
                return c;
            }
        }
        throw new IllegalArgumentException(num.toString());
    }
}