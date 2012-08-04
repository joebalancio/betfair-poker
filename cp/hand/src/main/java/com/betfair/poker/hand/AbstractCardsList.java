package com.betfair.poker.hand;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;


public abstract class AbstractCardsList<T> implements Serializable, Iterable<T> {
    private static final long serialVersionUID = -5496955843456754844L;
    public static final int SHIFT_LEFT = 0;
    public static final int SHIFT_RIGHT = 1;

    protected ArrayList<T> m_List;
    
    protected List<T> list() {
        return m_List;
    }

    protected void setList(List<T> list) {
        m_List = new ArrayList<T>(list);
    }

    public void clear() {
        m_List.clear();
    }

    public boolean isEmpty() {
        return m_List.isEmpty();
    }

    @Override
    public Iterator<T> iterator() {
        return m_List.iterator();
    }

    public ListIterator<T> listIterator() {
        return m_List.listIterator();
    }

    public ListIterator<T> listIterator(int index) {
        return m_List.listIterator(index);
    }

    public int size() {
        return m_List.size();
    }

    @Override
    public String toString() {
        return m_List.toString();
    }

    protected void add(T o) {
        m_List.add(o);
    }
    
    protected void addAll(List<T> o) {
        m_List.addAll(o);
    }

}
