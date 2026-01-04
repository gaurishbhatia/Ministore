import React from 'react'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import ProductList from './components/ProductList'
import './index.css'

function App() {
    return (
        <CartProvider>
            <ToastProvider>
                <div className="App">
                    <ProductList />
                </div>
            </ToastProvider>
        </CartProvider>
    )
}

export default App
