import sanitizeHtml from 'sanitize-html';

// Used for admin-authored rich content (e.g. NewsArticle.content) that is
// rendered via dangerouslySetInnerHTML. Admin accounts are trusted, but this
// still strips scripts/handlers/iframes etc. as defense-in-depth in case an
// admin account is ever compromised or pastes HTML from an untrusted source.
export function sanitizeRichText(html) {
  if (typeof html !== 'string' || !html) return html;

  return sanitizeHtml(html, {
    allowedTags: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's',
      'h2', 'h3', 'h4', 'blockquote',
      'ul', 'ol', 'li',
      'a', 'img',
      'figure', 'figcaption',
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
    },
  });
}
