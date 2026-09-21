'use client';
import { useState, useEffect } from 'react';
import { PageHeader, Card, Button, Field, Input, Textarea, ImageUploader, useToast, Skeleton } from '@/components/admin/ui';
import styles from './page.module.css';

export default function AdminSiteSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const showToast = useToast();

  useEffect(() => {
    fetch('/api/admin/site-settings')
      .then((res) => res.json())
      .then((data) => { setSettings(data); setLoading(false); });
  }, []);

  const set = (key, value) => setSettings((p) => ({ ...p, [key]: value }));
  const setPreset = (index, key, value) => {
    setSettings((p) => {
      const presets = [...p.donationPresets];
      presets[index] = { ...presets[index], [key]: key === 'amount' ? Number(value) : value };
      return { ...p, donationPresets: presets };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast('Site settings saved!');
    } catch (err) {
      showToast(err.message || 'Failed to save.', 'error');
    }
    setSaving(false);
  };

  if (loading || !settings) {
    return (
      <div>
        <PageHeader icon="⚙️" title="Site Settings" subtitle="Global branding, contact info, social links, and donation settings." />
        <Skeleton height="400px" radius="var(--radius-lg)" style={{ display: 'block', width: '100%' }} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave}>
      <PageHeader
        icon="⚙️"
        title="Site Settings"
        subtitle="Global branding, contact info, social links, and donation settings — used across the whole site."
        action={<Button type="submit" loading={saving}>Save All Settings</Button>}
      />

      <div className={styles.sections}>
        <Card className={styles.section}>
          <h3 className={styles.sectionTitle}>Branding &amp; SEO</h3>
          <div className={styles.fieldRow}>
            <Field label="Site Name"><Input value={settings.siteName} onChange={(e) => set('siteName', e.target.value)} /></Field>
            <Field label="Tagline"><Input value={settings.tagline} onChange={(e) => set('tagline', e.target.value)} /></Field>
          </div>
          <Field label="Meta Description" hint="Shown in search engine results and social share cards">
            <Textarea value={settings.metaDescription} onChange={(e) => set('metaDescription', e.target.value)} />
          </Field>
          <Field label="Meta Keywords" hint="Comma-separated">
            <Input value={settings.metaKeywords} onChange={(e) => set('metaKeywords', e.target.value)} />
          </Field>
          <Field label="Social Share Image">
            <ImageUploader folder="about" value={settings.shareImage} onChange={(url) => set('shareImage', url)} label="Upload Share Image" />
          </Field>
        </Card>

        <Card className={styles.section}>
          <h3 className={styles.sectionTitle}>Contact Info</h3>
          <Field label="Address"><Textarea rows={2} value={settings.address} onChange={(e) => set('address', e.target.value)} /></Field>
          <div className={styles.fieldRow}>
            <Field label="Phone"><Input value={settings.phone} onChange={(e) => set('phone', e.target.value)} /></Field>
            <Field label="Phone Hours"><Input value={settings.phoneHours} onChange={(e) => set('phoneHours', e.target.value)} /></Field>
          </div>
          <div className={styles.fieldRow}>
            <Field label="Emergency Phone Label"><Input value={settings.emergencyPhoneLabel} onChange={(e) => set('emergencyPhoneLabel', e.target.value)} /></Field>
            <Field label="Emergency Phone"><Input value={settings.emergencyPhone} onChange={(e) => set('emergencyPhone', e.target.value)} /></Field>
          </div>
          <div className={styles.fieldRow}>
            <Field label="Email"><Input type="email" value={settings.email} onChange={(e) => set('email', e.target.value)} /></Field>
            <Field label="Partnerships Email"><Input type="email" value={settings.partnershipsEmail} onChange={(e) => set('partnershipsEmail', e.target.value)} /></Field>
          </div>
        </Card>

        <Card className={styles.section}>
          <h3 className={styles.sectionTitle}>Social Links</h3>
          <p className={styles.sectionHint}>Leave blank to hide an icon in the footer.</p>
          <div className={styles.fieldRow}>
            <Field label="Facebook URL"><Input placeholder="https://facebook.com/…" value={settings.facebookUrl} onChange={(e) => set('facebookUrl', e.target.value)} /></Field>
            <Field label="Instagram URL"><Input placeholder="https://instagram.com/…" value={settings.instagramUrl} onChange={(e) => set('instagramUrl', e.target.value)} /></Field>
          </div>
          <div className={styles.fieldRow}>
            <Field label="Twitter / X URL"><Input placeholder="https://x.com/…" value={settings.twitterUrl} onChange={(e) => set('twitterUrl', e.target.value)} /></Field>
            <Field label="LinkedIn URL"><Input placeholder="https://linkedin.com/…" value={settings.linkedinUrl} onChange={(e) => set('linkedinUrl', e.target.value)} /></Field>
          </div>
        </Card>

        <Card className={styles.section}>
          <h3 className={styles.sectionTitle}>Footer</h3>
          <Field label="Brand Description"><Textarea value={settings.footerDescription} onChange={(e) => set('footerDescription', e.target.value)} /></Field>
          <Field label="Copyright Name" hint='Shown as "© {year} — this name — All rights reserved."'>
            <Input value={settings.copyrightName} onChange={(e) => set('copyrightName', e.target.value)} />
          </Field>
        </Card>

        <Card className={styles.section}>
          <h3 className={styles.sectionTitle}>Donation Settings</h3>
          <p className={styles.sectionHint}>These 4 preset amounts appear on both the homepage donate button and the full Donate page.</p>
          {settings.donationPresets.map((preset, i) => (
            <div key={i} className={styles.presetRow}>
              <Field label={`Preset ${i + 1} Amount (₹)`}>
                <Input type="number" min="1" value={preset.amount} onChange={(e) => setPreset(i, 'amount', e.target.value)} />
              </Field>
              <Field label="Impact Description">
                <Input value={preset.description} onChange={(e) => setPreset(i, 'description', e.target.value)} />
              </Field>
            </div>
          ))}
          <Field label="Tax Note">
            <Textarea rows={2} value={settings.donationTaxNote} onChange={(e) => set('donationTaxNote', e.target.value)} />
          </Field>
        </Card>
      </div>
    </form>
  );
}
