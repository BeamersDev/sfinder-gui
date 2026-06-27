import { useMemo } from 'react';
import DOMPurify from 'dompurify';

interface SanitizedHtmlProps {
  html: string;
  className?: string;
}

const ALLOWED_TAGS = [
  'html', 'head', 'body', 'div', 'span', 'table', 'thead', 'tbody', 'tr', 'td', 'th',
  'caption', 'colgroup', 'col',
  'a', 'img', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'dl', 'dt', 'dd',
  'br', 'hr', 'pre', 'code', 'b', 'i', 'u', 'strong', 'em', 'small', 'sub', 'sup',
  'blockquote', 'details', 'summary',
];

const ALLOWED_ATTR = [
  'href', 'src', 'alt', 'class', 'id', 'style', 'target', 'rel',
  'colspan', 'rowspan', 'border', 'width', 'height', 'align', 'valign',
  'title', 'data-*',
];

export default function SanitizedHtml({ html, className }: SanitizedHtmlProps) {
  const sanitized = useMemo(
    () =>
      DOMPurify.sanitize(html, {
        ALLOWED_TAGS,
        ALLOWED_ATTR,
        ALLOW_DATA_ATTR: true,
      }),
    [html],
  );

  if (!html || html.trim().length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic">
        No HTML output available.
      </div>
    );
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
