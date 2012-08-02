package com.betfair.poker.game;

public enum GameStatus {
    DEAL("Deal"),
    FLOP("Flop"),
    TURN("Turn"),
    RIVER("River"),
    SHOWDOWN("Showdown");

    private final String value;

    GameStatus(final String v) {
        this.value = v;
    }

    public String getValue() {
        return value;
    }

    public static GameStatus fromValue(final String v) {
        for (GameStatus c : GameStatus.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v.toString());
    }
    
    @Override
    public String toString() {
        return value;
    }
}