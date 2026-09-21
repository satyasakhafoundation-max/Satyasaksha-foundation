import { getPageContent } from '@/lib/pageContent';
import styles from './page.module.css';

export const revalidate = 60;

export async function generateMetadata() {
  const content = await getPageContent('privacyPolicy');
  return {
    title: `${content.title} | Satyasaksha Foundation`,
  };
}

export default async function PrivacyPolicyPage() {
  const content = await getPageContent('privacyPolicy');

  return (
    <div className={styles.pageWrap}>
      <div className="container">
        <div className={styles.header}>
          <h1 className="heading-hero">{content.title}</h1>
          {content.lastUpdated && <p className={styles.lastUpdated}>Last updated: {content.lastUpdated}</p>}
        </div>
        <div className={styles.body} dangerouslySetInnerHTML={{ __html: content.body }} />
      </div>
    </div>
  );
}
