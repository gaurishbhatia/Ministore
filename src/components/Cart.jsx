import React from 'react';
import styles from './Cart.module.css';
import { useCart } from '../hooks/useCart';

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const Cart = ({ onClose }) => {
    const { cart, total, itemCount, removeFromCart, updateQuantity } = useCart();

    return (
        <div className={styles.cartContainer}>
            <div className={styles.header}>
                <h2 className={styles.heading}>Your Cart <span className={styles.count}>({itemCount})</span></h2>
                {onClose && (
                    <button onClick={onClose} className={styles.closeBtn} aria-label="Close Cart">
                        <CloseIcon />
                    </button>
                )}
            </div>

            {cart.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🛒</div>
                    <p>Your cart is empty.</p>
                    <button onClick={onClose} className={styles.startShoppingBtn}>Start Shopping</button>
                </div>
            ) : (
                <>
                    <div className={styles.items}>
                        {cart.map(item => (
                            <div key={item.id} className={styles.cartItem}>
                                <div className={styles.imageWrapper}>
                                    <img src={item.thumbnail} alt={item.title} className={styles.itemImage} />
                                </div>
                                <div className={styles.itemDetails}>
                                    <div className={styles.itemHeader}>
                                        <h4 className={styles.itemTitle}>{item.title}</h4>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className={styles.removeBtn}
                                            title="Remove item"
                                        >&times;</button>
                                    </div>
                                    <p className={styles.itemPrice}>${item.price.toFixed(2)}</p>

                                    <div className={styles.controlsWrapper}>
                                        <div className={styles.controls}>
                                            <button
                                                disabled={item.quantity <= 1}
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className={styles.qtyBtn}
                                            >-</button>
                                            <span className={styles.qty}>{item.quantity}</span>
                                            <button
                                                disabled={item.quantity >= item.stock}
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className={styles.qtyBtn}
                                            >+</button>
                                        </div>
                                        <div className={styles.subtotal}>
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.footer}>
                        <div className={styles.totalRow}>
                            <span>Subtotal</span>
                            <span className={styles.totalAmount}>${total.toFixed(2)}</span>
                        </div>
                        <p className={styles.shippingNote}>Shipping & taxes calculated at checkout</p>
                        <button className={styles.checkoutBtn}>Proceed to Checkout</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
