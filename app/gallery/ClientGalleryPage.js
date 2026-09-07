'use client';
import { useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import Image from 'next/image';
import styles from './page.module.css';

const FILTER_CATEGORIES = ['All', 'Wildlife', 'Community', 'Events', 'Environment', 'Other'];

export default function ClientGalleryPage({ images }) {
  useReveal();
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? images
    : images.filter((img) => img.category === activeFilter);

  return (
    <div className={styles.pageWrap}>
      
      {/* Page Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2500&auto=format&fit=crop")' }}></div>
        <div className={styles.heroOverlay}></div>
        <div className={`container ${styles.heroContent}`}>
          <h1 className="heading-hero reveal">In Pictures</h1>
          <p className={`reveal reveal-delay-1 ${styles.heroSub}`}>
            A visual journey of our efforts, our people, and the beautiful planet we are fighting to protect.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className={`section ${styles.gallerySection}`}>
        <div className="container">
          
          <div className={styles.filterBar}>
            {FILTER_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`${styles.filterBtn} ${activeFilter === cat ? styles.active : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className={styles.grid}>
            {filtered.map((item, i) => (
              <div key={item._id || item.id} className={`reveal reveal-delay-${(i % 4) + 1} ${styles.item}`}>
                <div className={styles.imageWrapper}>
                  {/* Use next/image for lazy loading, WebP conversion, and proper sizing */}
                  <Image
                    src={item.thumbnailUrl || item.imageUrl}
                    alt={item.caption}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={styles.image}
                    loading="lazy"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className={styles.overlay}>
                  <span>{item.caption}</span>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p style={{ textAlign: 'center', color: 'rgba(0,0,0,0.4)', padding: '40px 0' }}>
              No images in this category yet.
            </p>
          )}

        </div>
      </section>

    </div>
  );
}
