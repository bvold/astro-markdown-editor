// src/components/Editor.jsx

import React, { useState, useEffect, useRef } from 'react';
import { GitHubService } from '../utils/github';
import MarkdownRenderer from './MarkdownRenderer';

const github = new GitHubService();

export default function Editor() {
  const [currentFile, setCurrentFile] = useState({ owner: '', repo: '', path: '', sha: '', content: '' });
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isFileLoaded, setIsFileLoaded] = useState(false);
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (isEditing && !quillRef.current) {
      import('quill').then((Quill) => {
        import('quill/dist/quill.snow.css');
        quillRef.current = new Quill.default(editorRef.current, {
          theme: 'snow'
        });
        quillRef.current.setText(currentFile.content);
      });
    }

    return () => {
      if (quillRef.current) {
        quillRef.current = null;
      }
    };
  }, [isEditing, currentFile.content]);

  const loadFile = async () => {
    setError(null);
    try {
      const fileData = await github.getFile(currentFile.owner, currentFile.repo, currentFile.path);
      setCurrentFile(prev => ({ ...prev, ...fileData }));
      setIsFileLoaded(true);
      setIsEditing(false);
    } catch (error) {
      console.error('Error loading file:', error);
      setError(`Error loading file: ${error.message}`);
    }
  };

  const saveFile = async () => {
    if (!quillRef.current) return;
    setError(null);
    try {
      const content = quillRef.current.getText();
      await github.saveFile(
        currentFile.owner,
        currentFile.repo,
        currentFile.path,
        content,
        'Update file via web editor',
        currentFile.sha
      );
      // After successful save, fetch the updated file info
      await loadFile();
      setIsEditing(false);
      alert('File saved successfully!');
    } catch (error) {
      console.error('Error saving file:', error);
      setError(`Error saving file: ${error.message}`);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const resetFileSelection = () => {
    setCurrentFile({ owner: '', repo: '', path: '', sha: '', content: '' });
    setIsFileLoaded(false);
    setIsEditing(false);
    setError(null);
  };

  return (
    <div>
      {!isFileLoaded ? (
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
      ) : (
        <div>
          <p>Current file: {currentFile.owner}/{currentFile.repo}/{currentFile.path}</p>
          <button onClick={resetFileSelection}>Change File</button>
        </div>
      )}
      {error && <div style={{color: 'red'}}>{error}</div>}
      {isFileLoaded && !isEditing && (
        <div>
          <MarkdownRenderer content={currentFile.content} />
          <button onClick={toggleEdit}>Edit</button>
        </div>
      )}
      {isEditing && (
        <div>
          <div ref={editorRef} style={{height: '400px'}}></div>
          <button onClick={saveFile}>Save</button>
          <button onClick={toggleEdit}>Cancel</button>
        </div>
      )}
    </div>
  );
}