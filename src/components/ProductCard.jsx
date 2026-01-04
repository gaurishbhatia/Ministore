import React, { memo } from 'react';
import styles from './ProductCard.module.css';
import { useCart } from '../hooks/useCart';
import { useToast } from '../context/ToastContext';

// Pure UI Component
const ProductCardUI = memo(({ product, quantityInCart, onAdd, onOpenModal }) => {
    const isOutOfStock = product.stock === 0;
    const isMaxStock = quantityInCart >= product.stock;

    return (
        <div className={styles.card}>
            <div
                className={styles.imageContainer}
                onClick={() => onOpenModal(product)}
                role="button"
                tabIndex={0}
            >
                <img src={product.thumbnail} alt={product.title} className={styles.image} loading="lazy" />
            </div>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.title} onClick={() => onOpenModal(product)}>{product.title}</h3>
                    <span className={styles.price}>${product.price}</span>
                </div>
                <div className={styles.category}>{product.category}</div>
                <div className={styles.footer}>
                    <span className={`${styles.status} ${isOutOfStock ? styles.outStock : styles.inStock}`}>
                        {isOutOfStock ? 'Out of Stock' : `${product.stock} in stock`}
                    </span>
                    <button
                        className={styles.button}
                        onClick={() => onAdd(product)}
                        disabled={isOutOfStock || isMaxStock}
                    >
                        {isMaxStock ? 'Limit Reached' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
});

// Connected Component
const ProductCard = ({ product, onOpenModal }) => {
    const { cart, addToCart } = useCart();
    const { addToast } = useToast();
    const cartItem = cart.find(item => item.id === product.id);
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    const handleAdd = (p) => {
        addToCart(p);
        addToast(`Added ${p.title} to cart`, 'success');
    };

    return (
        <ProductCardUI
            product={product}
            quantityInCart={quantityInCart}
            onAdd={handleAdd}
            onOpenModal={onOpenModal}
        />
    );
};

// We wrap the connected component in memo so that if the PARENT (ProductList) re-renders,
// this component only re-renders if props (product) change.
// However, since it uses useCart, it will also re-render if Context changes.
export default memo(ProductCard);
