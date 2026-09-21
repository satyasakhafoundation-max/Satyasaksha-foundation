'use client';
import { useState } from 'react';
import styles from './ReorderableList.module.css';

// Native HTML5 drag-and-drop reordering — no extra dependency.
// Drag is initiated from the grip handle only, so inputs/buttons inside
// each row stay fully interactive. Calls onReorder(reorderedItems) on drop.
export default function ReorderableList({ items, onReorder, renderItem, keyField = '_id' }) {
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  const handleDrop = (targetIndex) => {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }
    const reordered = [...items];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    setDragIndex(null);
    setOverIndex(null);
    onReorder(reordered);
  };

  return (
    <div className={styles.list}>
      {items.map((item, index) => (
        <div
          key={item[keyField]}
          className={`${styles.row} ${overIndex === index ? styles.over : ''} ${dragIndex === index ? styles.dragging : ''}`}
          onDragOver={(e) => { e.preventDefault(); setOverIndex(index); }}
          onDragLeave={() => setOverIndex((cur) => (cur === index ? null : cur))}
          onDrop={(e) => { e.preventDefault(); handleDrop(index); }}
        >
          <span
            className={styles.handle}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragEnd={() => { setDragIndex(null); setOverIndex(null); }}
            title="Drag to reorder"
          >
            ⠿
          </span>
          <div className={styles.content}>{renderItem(item, index)}</div>
        </div>
      ))}
    </div>
  );
}
