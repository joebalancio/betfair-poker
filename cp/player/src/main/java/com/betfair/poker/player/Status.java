package com.betfair.poker.player;


public enum Status {
    
    /** Posting the small blind. */
    SMALL_BLIND("Small Blind", "posts the small blind"),

    /** Posting the big blind. */
    BIG_BLIND("Big Blind", "posts the big blind"),
    
    /** Continuing the game. */
    CONTINUE("Continue", "continues");
    
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
    Status(String name, String verb) {
        this.name = name;
        this.verb = verb;
    }

    public static Status fromName(final String v) {
        for (Status c : Status.values()) {
            if (c.name.equalsIgnoreCase(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v.toString());
    }
    
    /**
     * 
     * 
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
    
    @Override
    public String toString() {
        return name;
    }
}
