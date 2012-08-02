package com.betfair.poker.table;

import com.betfair.poker.player.Player;


/**
 * A single poker seat.
 */
public class Seat {
    private final int position;
    private Player player;
    private boolean isDealer;
    private boolean isSmallBlind;
    private boolean isBigBlind;
    private boolean isTurn;
    
    
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

    public boolean isBigBlind() {
        if ((getPlayer() != null) && (isBigBlind)) {
            return true;
        }
        
        return false;
    }
    
    public void setBigBlind(final boolean isBigBlind) {
        this.isBigBlind = isBigBlind;
    }
    
    public boolean isSmallBlind() {
        if ((getPlayer() != null) && (isSmallBlind)) {
            return true;
        }
        
        return false;
    }
    
    public void setSmallBlind(final boolean isSmallBlind) {
        this.isSmallBlind = isSmallBlind;
    }
    
    public boolean isTurn() {
        if ((getPlayer() != null) && (isTurn)) {
            return true;
        }
        
        return false;
    }
    
    public void setTurn(final boolean isTurn) {
        this.isTurn = isTurn;
    }
    
    public String getGamePosition() {
        if (isDealer()) {
            return "dealer";
        } else if (isBigBlind()) {
            return "big blind";
        } else if (isSmallBlind()) {
            return "small blind";
        }
        
        return null;
    }
}