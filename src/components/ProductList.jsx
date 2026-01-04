import React, { useState, useMemo } from 'react';
import styles from './ProductList.module.css';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useDebounce } from '../hooks/useDebounce';
import ProductCard from './ProductCard';
import FilterBar from './FilterBar';
import Modal from './Modal';
import Cart from './Cart';

const ProductList = () => {
    const { products, loading, error } = useProducts();
    const { cart } = useCart();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Derive categories
    const categories = useMemo(() => {
        return [...new Set(products.map(p => p.category))];
    }, [products]);

    // Combined Filter Logic
    const filteredProducts = useMemo(() => {
        let result = products;

        // 1. Search
        if (debouncedSearchTerm) {
            const lowerTerm = debouncedSearchTerm.toLowerCase();
            result = result.filter(p => p.title.toLowerCase().includes(lowerTerm));
        }

        // 2. Category
        if (selectedCategory) {
            result = result.filter(p => p.category === selectedCategory);
        }

        // 3. Sort
        if (sortOrder) {
            result = [...result].sort((a, b) => {
                if (sortOrder === 'low') return a.price - b.price;
                if (sortOrder === 'high') return b.price - a.price;
                return 0;
            });
        }

        return result;
    }, [products, debouncedSearchTerm, selectedCategory, sortOrder]);

    if (loading) return <div className={styles.center}>Loading products...</div>;
    if (error) return <div className={styles.center}>Error: {error}</div>;

    return (
        <div className={styles.container}>
            {/* Header / Nav */}
            <header className={styles.header}>
                <h1 className={styles.logo}>MiniStore</h1>
                <button className={styles.cartBtn} onClick={() => setIsCartOpen(!isCartOpen)}>
                    Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})
                </button>
            </header>

            <div className={styles.mainLayout}>
                <div className={styles.contentArea}>
                    <FilterBar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                        sortOrder={sortOrder}
                        onSortChange={setSortOrder}
                        categories={categories}
                        onClear={() => {
                            setSearchTerm('');
                            setSelectedCategory('');
                            setSortOrder('');
                        }}
                    />

                    {filteredProducts.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>No products found matching your criteria.</p>
                        </div>
                    ) : (
                        <div className={styles.grid}>
                            {filteredProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onOpenModal={setSelectedProduct}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Cart Sidebar (Desktop) or Overlay (Mobile) */}
                {isCartOpen && (
                    <div className={styles.cartSidebar}>
                        <Cart onClose={() => setIsCartOpen(false)} />
                    </div>
                )}
            </div>

            <Modal
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                product={selectedProduct}
            />
        </div>
    );
};

export default ProductList;
