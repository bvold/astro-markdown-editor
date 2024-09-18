// src/components/MarkdownRenderer.jsx

import React from 'react';
import ReactMarkdown from 'react-markdown';

const MarkdownRenderer = ({ content }) => {
  return <ReactMarkdown>{content}</ReactMarkdown>;
};

export default MarkdownRenderer;