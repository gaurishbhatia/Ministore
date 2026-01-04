import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styles from './Toast.module.css';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success') => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            {createPortal(
                <div className={styles.toastContainer}>
                    {toasts.map(toast => (
                        <div
                            key={toast.id}
                            className={`${styles.toast} ${styles[toast.type]}`}
                            onClick={() => removeToast(toast.id)}
                        >
                            {toast.type === 'success' && <span style={{ color: '#10b981' }}>✓</span>}
                            {toast.message}
                        </div>
                    ))}
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
