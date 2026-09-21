'use client';
import { useState, useEffect, useMemo } from 'react';
import { PageHeader, Card, Button, Badge, ConfirmButton, useToast, SkeletonList, EmptyState, SearchInput, Pagination } from '@/components/admin/ui';
import styles from './page.module.css';

const SUBJECT_LABELS = {
  general: 'General Inquiry',
  volunteer: 'Volunteering',
  partner: 'Partnership',
  membership: 'Foundation Membership',
  rescue: 'Animal Rescue Report',
};

const PAGE_SIZE = 10;

export default function AdminContactsPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const showToast = useToast();

  const fetchMessages = async () => {
    setLoading(true);
    const res = await fetch('/api/contact');
    const data = await res.json();
    setMessages(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return messages;
    return messages.filter((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.message.toLowerCase().includes(q));
  }, [messages, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleToggleRead = async (item) => {
    try {
      await fetch('/api/contact', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item._id, isRead: !item.isRead }) });
      fetchMessages();
    } catch {
      showToast('Failed to update.', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/contact?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showToast('Message deleted.');
      fetchMessages();
    } catch {
      showToast('Failed to delete.', 'error');
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div>
      <PageHeader
        icon="📬"
        title={<>Messages{unreadCount > 0 && <Badge variant="gold"> {unreadCount} unread</Badge>}</>}
        subtitle="Contact form submissions from visitors. Click a message to expand and view the full content."
      />

      <div className={styles.toolbar}>
        <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="Search messages…" />
      </div>

      {loading ? <SkeletonList count={4} /> : filtered.length === 0 ? (
        <EmptyState icon="📭" title={query ? 'No messages found' : 'No contact messages yet'} />
      ) : (
        <>
          <div className={styles.list}>
            {pageItems.map((item) => (
              <Card key={item._id} className={`${styles.card} ${!item.isRead ? styles.cardUnread : ''}`} style={{ padding: 0 }}>
                <div className={styles.cardTop} onClick={() => setExpanded(expanded === item._id ? null : item._id)}>
                  <div className={styles.cardLeft}>
                    {!item.isRead && <div className={styles.unreadDot} />}
                    <div>
                      <div className={styles.senderRow}>
                        <span className={styles.senderName}>{item.name}</span>
                        <Badge variant="neutral">{SUBJECT_LABELS[item.subject] || item.subject}</Badge>
                      </div>
                      <div className={styles.senderEmail}>{item.email}</div>
                    </div>
                  </div>
                  <div className={styles.cardRight}>
                    <span className={styles.dateText}>{new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className={styles.chevron}>{expanded === item._id ? '▲' : '▼'}</span>
                  </div>
                </div>

                {expanded === item._id && (
                  <div className={styles.cardBody}>
                    <div className={styles.messageBox}>
                      <p className={styles.messageText}>{item.message}</p>
                    </div>
                    <div className={styles.actions}>
                      <a href={`mailto:${item.email}`} className={styles.replyBtn}>✉ Reply via Email</a>
                      <Button variant="ghost" size="sm" onClick={() => handleToggleRead(item)}>{item.isRead ? '○ Mark Unread' : '✓ Mark Read'}</Button>
                      <ConfirmButton onConfirm={() => handleDelete(item._id)} label="🗑 Delete" />
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}
