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
    private boolean isWinner;
    
    
    public Seat(final int position) {
        this.position = position;
    }
    
    public void reset() {
        isDealer = false;
        isSmallBlind = false;
        isBigBlind = false;
        isTurn = false;
        isWinner = false;
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

    public boolean isWinner() {
        if ((getPlayer() != null) && (isWinner)) {
            return true;
        }
        
        return false;
    }
    
    public void setWinner(final boolean isWinner) {
        this.isWinner = isWinner;
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
            return "DEALER";
        } else if (isBigBlind()) {
            return "BIG BLIND";
        } else if (isSmallBlind()) {
            return "SMALL BLIND";
        }
        
        return "NONE";
    }
}