'use client';
import { useState, useMemo } from 'react';
import styles from './page.module.css';

export default function ClientProductsPage({ products }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ['All', ...Array.from(set)];
  }, [products]);

  const filtered = activeCategory === 'All'
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <div className={styles.pageWrap}>

      {/* Page Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2500&auto=format&fit=crop")' }}></div>
        <div className={styles.heroOverlay}></div>
        <div className={`container ${styles.heroContent}`}>
          <h1 className="heading-hero reveal">Our Merchandise</h1>
          <p className={`reveal reveal-delay-1 ${styles.heroSub}`}>
            Handpicked keepsakes that support our mission — every purchase helps fund conservation and community work.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {categories.length > 1 && (
            <div className={styles.filterBar}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`${styles.filterChip} ${activeCategory === cat ? styles.filterChipActive : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No products available in this category yet — check back soon.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map((product, i) => (
                <div key={product._id || product.id} className={`reveal reveal-delay-${(i % 4) + 1} ${styles.card}`}>
                  <div className={styles.imageWrap}>
                    <div className={styles.image} style={{ backgroundImage: `url(${product.images?.[0] || ''})` }}></div>
                    {!product.isAvailable && <span className={styles.outOfStockBadge}>Out of Stock</span>}
                  </div>
                  <div className={styles.content}>
                    <p className={styles.category}>{product.category}</p>
                    <h3 className={styles.name}>{product.name}</h3>
                    {product.description && <p className={styles.desc}>{product.description}</p>}
                    <div className={styles.priceRow}>
                      <span className={styles.price}>₹{product.price}</span>
                      <a
                        href={`mailto:contact@satyasakshafoundation.org?subject=${encodeURIComponent('Order Enquiry: ' + product.name)}`}
                        className="btn btn--outline"
                        style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                      >
                        {product.isAvailable ? 'Enquire to Order' : 'Notify Me'}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
