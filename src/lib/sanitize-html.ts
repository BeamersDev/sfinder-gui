import DOMPurify from 'dompurify';

/**
 * Sanitize HTML output from sfinder for safe rendering.
 * Allows table structure, links, and basic formatting.
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'html', 'head', 'body',
      'div', 'span',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'caption', 'colgroup', 'col',
      'a', 'img',
      'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'dl', 'dt', 'dd',
      'br', 'hr',
      'pre', 'code',
      'b', 'i', 'u', 'strong', 'em', 'small', 'sub', 'sup', 'mark',
      'blockquote', 'details', 'summary',
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title',
      'class', 'id', 'style',
      'target', 'rel',
      'colspan', 'rowspan',
      'border', 'width', 'height',
      'align', 'valign',
      'data-*',
    ],
    ALLOW_DATA_ATTR: true,
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
  });
}

/**
 * Sanitize HTML and make fumen links interactive.
 * Converts sfinder's fumen links to clickable elements.
 */
export function sanitizeAndEnhance(dirty: string): string {
  const clean = sanitizeHtml(dirty);

  // Add target="_blank" to external links
  const withTargets = clean.replace(
    /<a\s+href="(https?:[^"]+)"/gi,
    '<a href="$1" target="_blank" rel="noopener noreferrer"',
  );

  return withTargets;
}
