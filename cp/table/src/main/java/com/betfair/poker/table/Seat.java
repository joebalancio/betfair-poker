package com.betfair.poker.table;

import com.betfair.poker.player.Player;


/**
 * A single poker seat.
 */
public class Seat {
    private final int position;
    private Player player;
    private boolean isDealer;
    
    
    public Seat(final int position) {
        this.position = position;
    }
    
    public int getPosition() {
        return position;
    }

    public Player getPlayer() {
        return player;
    }
    
    public void addPlayer(final Player player) {
        if (getPlayer() == null) {
            this.player = player;
        }
    }
    
    public void removePlayer() {
        this.player = null;
    }
    
    public boolean isEmpty() {
        if (getPlayer() == null) {
            return true;
        }
        
        return false;
    }
    
    public boolean isDealer() {
        if ((getPlayer() != null) && (isDealer)) {
            return true;
        }
        
        return false;
    }
    
    public void setDealer(final boolean isDealer) {
        this.isDealer = isDealer;
    }
}