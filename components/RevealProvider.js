'use client';
import { useEffect } from 'react';

// Global reveal observer — runs on every page, works with Server Components
// Observes all .reveal elements and adds 'active' class when they scroll into view
export default function RevealProvider() {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all current reveal elements
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    // Also observe dynamically added elements (for client-side navigation)
    const mutationObserver = new MutationObserver(() => {
      const newElements = document.querySelectorAll('.reveal:not(.observed)');
      newElements.forEach((el) => {
        el.classList.add('observed');
        observer.observe(el);
      });
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  // Renders nothing — purely behavioral
  return null;
}
