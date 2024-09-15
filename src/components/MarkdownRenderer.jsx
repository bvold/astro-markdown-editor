// src/components/MarkdownRenderer.jsx

import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function MarkdownRenderer({ content }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}