'use client';
import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function ClientNewsArticlePage({ article, suggestions = [] }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const images = article.images || [];

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const showPrev = useCallback((e) => {
    e.stopPropagation();
    setLightboxIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);
  const showNext = useCallback((e) => {
    e.stopPropagation();
    setLightboxIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setLightboxIndex((i) => (i + 1) % images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, images.length, closeLightbox]);

  return (
    <div className={styles.pageWrap}>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} style={{ backgroundImage: `url(${article.imageUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2500&auto=format&fit=crop'})` }}></div>
        <div className={styles.heroOverlay}></div>
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.meta}>
            <span className={styles.category}>{article.category}</span>
            <span className={styles.date}>{article.date}</span>
            {article.author && <span className={styles.author}>By {article.author}</span>}
          </div>
          <h1 className={`heading-hero ${styles.title}`}>{article.title}</h1>
        </div>
      </section>

      {/* Body */}
      <section className={`section ${styles.bodySection}`}>
        <div className="container">
          <div className={styles.bodyGrid}>
            <p className={styles.excerpt}>{article.excerpt}</p>
            {article.content ? (
              <div className={styles.content} dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : null}

            <div className={styles.actionRow}>
              {images.length > 0 && (
                <a href="#article-images" className="btn btn--outline">
                  View Images ({images.length})
                </a>
              )}
              <Link href="/news" className={styles.backLink}>← Back to News &amp; Blogs</Link>
            </div>
          </div>
        </div>
      </section>

      {/* View Images gallery */}
      {images.length > 0 && (
        <section id="article-images" className={`section ${styles.imagesSection}`}>
          <div className="container">
            <div className="section-header reveal">
              <p className="label">In Pictures</p>
              <h2 className="heading-lg">View Images</h2>
              <div className="divider-gold"></div>
            </div>
            <div className={styles.imagesGrid}>
              {images.map((img, i) => (
                <button key={i} className={styles.imageThumb} onClick={() => setLightboxIndex(i)} aria-label={`View image ${i + 1}`}>
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* You Might Also Like — random suggestions */}
      {suggestions.length > 0 && (
        <section className={`section ${styles.suggestionsSection}`}>
          <div className="container">
            <div className="section-header reveal">
              <p className="label">Keep Reading</p>
              <h2 className="heading-lg">You Might Also Like</h2>
              <div className="divider-gold"></div>
            </div>
            <div className={styles.suggestionsGrid}>
              {suggestions.map((s) => (
                <Link href={s.link} key={s.id} className={styles.suggestionCard}>
                  <div className={styles.suggestionImage} style={{ backgroundImage: `url(${s.image})` }}></div>
                  <div className={styles.suggestionContent}>
                    <span className={styles.suggestionCategory}>{s.category}</span>
                    <h3 className={styles.suggestionTitle}>{s.title}</h3>
                    <p className={styles.suggestionExcerpt}>{s.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button className={styles.lightboxClose} onClick={closeLightbox} aria-label="Close">✕</button>
          {images.length > 1 && (
            <>
              <button className={`${styles.lightboxNav} ${styles.lightboxPrev}`} onClick={showPrev} aria-label="Previous image">‹</button>
              <button className={`${styles.lightboxNav} ${styles.lightboxNext}`} onClick={showNext} aria-label="Next image">›</button>
            </>
          )}
          <img
            src={images[lightboxIndex]}
            alt=""
            className={styles.lightboxImg}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
