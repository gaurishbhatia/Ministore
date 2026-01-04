import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ isOpen, onClose, product }) => {
    if (!isOpen || !product) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                <div className={styles.content}>
                    <div className={styles.imageContainer}>
                        <img src={product.thumbnail} alt={product.title} className={styles.image} />
                    </div>
                    <div className={styles.details}>
                        <h2 className={styles.title}>{product.title}</h2>
                        <div className={styles.meta}>
                            <span className={styles.category}>{product.category}</span>
                            <span className={styles.price}>${product.price}</span>
                        </div>
                        <p className={styles.description}>{product.description}</p>
                        <div className={styles.stockInfo}>
                            Status: {product.stock > 0 ? 'In Stock' : 'Out of Stock'} ({product.stock})
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
