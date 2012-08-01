package com.betfair.poker.player;

public enum Action {

    /** Checking. */
    CHECK("Check", "checks"),

    /** Calling a bet. */
    CALL("Call", "calls"),

    /** Place an initial bet. */
    BET("Bet", "bets"),

    /** Raising the current bet. */
    RAISE("Raise", "raises"),

    ALL_IN("All-in", "goes all-in"),

    /** Folding. */
    FOLD("Fold", "folds"),

    /** Continuing the game. */
    CONTINUE("Continue", "continues"),

    ;

    /** The name. */
    private final String name;

    /** The verb. */
    private final String verb;

    /**
     * Constructor.
     * 
     * @param name
     *            The name.
     */
    Action(String name, String verb) {
        this.name = name;
        this.verb = verb;
    }

    /**
     * Returns the name.
     * 
     * @return The name.
     */
    public String getName() {
        return name;
    }

    /**
     * Returns the verb form of this action.
     * 
     * @return The verb.
     */
    public String getVerb() {
        return verb;
    }

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Enum#toString()
     */
    @Override
    public String toString() {
        return name;
    }
}
