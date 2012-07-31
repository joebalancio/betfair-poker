package com.betfair.poker.chat;

public class Message {
    private String text;
    private String player;
    

    public Message() {
    }

    public String getText() {
        return this.text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getPlayer() {
        return this.player;
    }

    public void setPlayer(String player) {
        this.player = player;
    }
}