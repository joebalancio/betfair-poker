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
     * @see java.lang.Enum#toString()
     */
    @Override
    public String toString() {
        return name;
    }
}
