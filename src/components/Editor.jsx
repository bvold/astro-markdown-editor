// src/components/Editor.jsx

import React, { useState, useEffect } from 'react';
import { GitHubService } from '../utils/github';

// Note: In a production environment, you should use a secure method to handle authentication
const github = new GitHubService('your-github-token');

export default function Editor() {
  const [editor, setEditor] = useState(null);
  const [currentFile, setCurrentFile] = useState({ owner: '', repo: '', path: '', sha: '' });

  useEffect(() => {
    let quill;
    import('quill').then((Quill) => {
      import('quill/dist/quill.snow.css');
      quill = new Quill.default('#editor', {
        theme: 'snow'
      });
      setEditor(quill);
    });

    return () => {
      if (quill) {
        quill.destroy();
      }
    };
  }, []);

  const loadFile = async () => {
    try {
      const { content, sha } = await github.getFile(currentFile.owner, currentFile.repo, currentFile.path);
      if (editor) {
        editor.setText(content);
      }
      setCurrentFile(prev => ({ ...prev, sha }));
    } catch (error) {
      console.error('Error loading file:', error);
      alert('Error loading file. Please check your inputs and try again.');
    }
  };

  const saveFile = async () => {
    if (!editor) return;
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
      alert('File saved successfully!');
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Error saving file. Please try again.');
    }
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
      <div id="editor" style={{height: '400px'}}></div>
      <button onClick={saveFile}>Save</button>
    </div>
  );
}