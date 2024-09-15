// src/components/Editor.jsx

import React, { useState, useEffect } from 'react';
import { GitHubService } from '../utils/github';
import MarkdownRenderer from './MarkdownRenderer';

// Note: In a production environment, you should use a secure method to handle authentication
const github = new GitHubService('your-github-token');

export default function Editor() {
  const [editor, setEditor] = useState(null);
  const [currentFile, setCurrentFile] = useState({ owner: '', repo: '', path: '', sha: '', content: '' });
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    let quill;
    if (isEditing) {
      import('quill').then((Quill) => {
        import('quill/dist/quill.snow.css');
        quill = new Quill.default('#editor', {
          theme: 'snow'
        });
        setEditor(quill);
        if (currentFile.content) {
          quill.setText(currentFile.content);
        }
      });
    }

    return () => {
      if (quill) {
        quill.destroy();
      }
    };
  }, [isEditing, currentFile.content]);

  const loadFile = async () => {
    setError(null);
    try {
      const { content, sha } = await github.getFile(currentFile.owner, currentFile.repo, currentFile.path);
      setCurrentFile(prev => ({ ...prev, sha, content }));
    } catch (error) {
      console.error('Error loading file:', error);
      setError(`Error loading file: ${error.message}`);
    }
  };

  const saveFile = async () => {
    if (!editor) return;
    setError(null);
    try {
      const content = editor.getText();
      await github.saveFile(
        currentFile.owner,
        currentFile.repo,
        currentFile.path,
        content,
        'Update file via web editor',
        currentFile.sha
      );
      setCurrentFile(prev => ({ ...prev, content }));
      alert('File saved successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving file:', error);
      setError(`Error saving file: ${error.message}`);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div>
      <div>
        <input 
          type="text" 
          placeholder="Owner" 
          value={currentFile.owner}
          onChange={(e) => setCurrentFile(prev => ({ ...prev, owner: e.target.value }))}
        />
        <input 
          type="text" 
          placeholder="Repo" 
          value={currentFile.repo}
          onChange={(e) => setCurrentFile(prev => ({ ...prev, repo: e.target.value }))}
        />
        <input 
          type="text" 
          placeholder="File path" 
          value={currentFile.path}
          onChange={(e) => setCurrentFile(prev => ({ ...prev, path: e.target.value }))}
        />
        <button onClick={loadFile}>Load</button>
      </div>
      {error && <div style={{color: 'red'}}>{error}</div>}
      {currentFile.content && !isEditing && (
        <>
          <MarkdownRenderer content={currentFile.content} />
          <button onClick={toggleEdit}>Edit</button>
        </>
      )}
      {isEditing && (
        <>
          <div id="editor" style={{height: '400px'}}></div>
          <button onClick={saveFile}>Save</button>
          <button onClick={toggleEdit}>Cancel</button>
        </>
      )}
    </div>
  );
}