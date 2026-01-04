import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const initialState = {
    items: [],
    total: 0,
    itemCount: 0,
};

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'RESTORE_CART':
            return {
                ...state,
                items: action.payload,
                total: action.payload.reduce((sum, item) => sum + item.price * item.quantity, 0),
                itemCount: action.payload.reduce((sum, item) => sum + item.quantity, 0),
            };
        case 'ADD_ITEM': {
            const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
            let newItems;

            if (existingItemIndex > -1) {
                newItems = [...state.items];
                const item = newItems[existingItemIndex];
                // Stock check should theoretically happen before dispatch, but double check here or in UI
                const newQuantity = item.quantity + 1;
                newItems[existingItemIndex] = { ...item, quantity: newQuantity };
            } else {
                newItems = [...state.items, { ...action.payload, quantity: 1 }];
            }

            return {
                ...state,
                items: newItems,
                total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
                itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
            };
        }
        case 'REMOVE_ITEM': {
            const newItems = state.items.filter(item => item.id !== action.payload);
            return {
                ...state,
                items: newItems,
                total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
                itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
            };
        }
        case 'UPDATE_QUANTITY': {
            const { id, quantity } = action.payload;
            if (quantity < 1) return state; // Should use remove for 0

            const newItems = state.items.map(item =>
                item.id === id ? { ...item, quantity } : item
            );

            return {
                ...state,
                items: newItems,
                total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
                itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
            };
        }
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Persistence logic
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                const parsed = JSON.parse(savedCart);
                if (Array.isArray(parsed)) {
                    dispatch({ type: 'RESTORE_CART', payload: parsed });
                }
            } catch (e) {
                console.error("Failed to recover cart", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(state.items));
    }, [state.items]);

    return (
        <CartContext.Provider value={{ state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCartContext = () => useContext(CartContext);
