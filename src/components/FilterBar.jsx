import React from 'react';
import styles from './FilterBar.module.css';

const FilterBar = ({
    searchTerm,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    sortOrder,
    onSortChange,
    categories,
    onClear
}) => {
    return (
        <div className={styles.container}>
            <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className={styles.search}
            />

            <div className={styles.controls}>
                <select
                    value={selectedCategory}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className={styles.select}
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <select
                    value={sortOrder}
                    onChange={(e) => onSortChange(e.target.value)}
                    className={styles.select}
                >
                    <option value="">Sort by Price</option>
                    <option value="low">Low to High</option>
                    <option value="high">High to Low</option>
                </select>

                <button onClick={onClear} className={styles.clearBtn}>
                    Clear Filters
                </button>
            </div>
        </div>
    );
};

export default FilterBar;
