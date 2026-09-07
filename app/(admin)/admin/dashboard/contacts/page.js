'use client';
import { useState, useEffect } from 'react';

const SUBJECT_LABELS = {
  general: 'General Inquiry',
  volunteer: 'Volunteering',
  partner: 'Partnership',
  rescue: 'Animal Rescue Report',
};

export default function AdminContactsPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [msg, setMsg] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    const res = await fetch('/api/contact');
    const data = await res.json();
    setMessages(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const showMessage = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleToggleRead = async (item) => {
    try {
      await fetch('/api/contact', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item._id, isRead: !item.isRead }) });
      fetchMessages();
    } catch {
      showMessage('Failed to update.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/contact?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showMessage('Message deleted.');
      fetchMessages();
    } catch {
      showMessage('Failed to delete.', 'error');
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>
            📬 Messages
            {unreadCount > 0 && <span style={s.unreadBadge}>{unreadCount} unread</span>}
          </h1>
          <p style={s.sub}>Contact form submissions from visitors. Click a message to expand and view the full content.</p>
        </div>
      </div>

      {msg && <div style={{ ...s.msg, ...(msg.type === 'error' ? s.msgError : s.msgSuccess) }}>{msg.text}</div>}

      {loading ? (
        <p style={s.loadText}>Loading messages…</p>
      ) : messages.length === 0 ? (
        <div style={s.emptyState}>
          <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📭</p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem' }}>No contact messages yet.</p>
        </div>
      ) : (
        <div style={s.list}>
          {messages.map((item) => (
            <div key={item._id} style={{ ...s.card, ...(item.isRead ? {} : s.cardUnread) }}>
              <div style={s.cardTop} onClick={() => setExpanded(expanded === item._id ? null : item._id)}>
                <div style={s.cardLeft}>
                  {!item.isRead && <div style={s.unreadDot} />}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={s.senderName}>{item.name}</span>
                      <span style={s.subjectTag}>{SUBJECT_LABELS[item.subject] || item.subject}</span>
                    </div>
                    <div style={s.senderEmail}>{item.email}</div>
                  </div>
                </div>
                <div style={s.cardRight}>
                  <span style={s.dateText}>{new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span style={s.chevron}>{expanded === item._id ? '▲' : '▼'}</span>
                </div>
              </div>

              {expanded === item._id && (
                <div style={s.cardBody}>
                  <div style={s.messageBox}>
                    <p style={s.messageText}>{item.message}</p>
                  </div>
                  <div style={s.actions}>
                    <a href={`mailto:${item.email}`} style={s.replyBtn}>✉ Reply via Email</a>
                    <button onClick={() => handleToggleRead(item)} style={s.readBtn}>
                      {item.isRead ? '○ Mark Unread' : '✓ Mark Read'}
                    </button>
                    <button onClick={() => handleDelete(item._id)} style={s.deleteBtn}>🗑 Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  header: { marginBottom: '40px' },
  title: { color: '#fff', fontSize: '2rem', fontWeight: '700', margin: '0 0 8px', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '14px' },
  unreadBadge: { fontSize: '0.8rem', fontWeight: '700', background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37', padding: '4px 12px', borderRadius: '99px' },
  sub: { color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '1rem' },
  msg: { borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', fontSize: '0.9rem', fontWeight: '500' },
  msgSuccess: { background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#34d399' },
  msgError: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' },
  emptyState: { textAlign: 'center', padding: '80px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' },
  loadText: { color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', fontSize: '1.1rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  card: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', overflow: 'hidden', transition: 'all 0.2s' },
  cardUnread: { borderColor: 'rgba(212,175,55,0.2)', background: 'rgba(212,175,55,0.03)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', cursor: 'pointer', gap: '16px' },
  cardLeft: { display: 'flex', alignItems: 'center', gap: '14px', flex: 1 },
  unreadDot: { width: '8px', height: '8px', borderRadius: '50%', background: '#D4AF37', flexShrink: 0, boxShadow: '0 0 8px rgba(212,175,55,0.5)' },
  senderName: { color: '#fff', fontWeight: '700', fontSize: '1rem' },
  subjectTag: { fontSize: '0.75rem', fontWeight: '600', color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '3px 10px', borderRadius: '99px' },
  senderEmail: { color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '4px' },
  cardRight: { display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 },
  dateText: { color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem' },
  chevron: { color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' },
  cardBody: { padding: '0 24px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' },
  messageBox: { background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '20px', marginTop: '20px', marginBottom: '20px' },
  messageText: { color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0 },
  actions: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  replyBtn: { padding: '10px 18px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', color: '#D4AF37', fontWeight: '600', fontSize: '0.85rem', textDecoration: 'none', transition: 'all 0.2s' },
  readBtn: { padding: '10px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' },
  deleteBtn: { padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#f87171', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' },
};
