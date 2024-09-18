// src/components/Editor.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { GitHubService } from '../utils/github';
import MarkdownRenderer from './MarkdownRenderer';

const github = new GitHubService();

export default function Editor() {
  const [editor, setEditor] = useState(null);
  const [currentFile, setCurrentFile] = useState({ owner: '', repo: '', path: '', sha: '', content: '' });
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isFileLoaded, setIsFileLoaded] = useState(false);

  useEffect(() => {
    let quill = null;
    if (isEditing) {
      import('quill').then((Quill) => {
        import('quill/dist/quill.snow.css');
        quill = new Quill.default('#editor', {
          theme: 'snow'
        });
        setEditor(quill);
        
        quill.setText(currentFile.content);
      });
    }

    return () => {
      if (quill) {
        quill.disable(); // Disable the editor
        quill = null; // Set the reference to null
        setEditor(null); // Update the state
      }
    };
  }, [isEditing, currentFile.content]);
  
  const loadFile = async () => {
    setError(null);
    try {
      const { content, sha } = await github.getFile(currentFile.owner, currentFile.repo, currentFile.path);
      setCurrentFile(prev => ({ ...prev, sha, content }));
      setIsFileLoaded(true);
      setIsEditing(false);
    } catch (error) {
      console.error('Error loading file:', error);
      setError(`Error loading file: ${error.message}`);
    }
  };

  const saveFile = useCallback(async () => {
    if (!editor) {
      setError("Editor not initialized");
      return;
    }
    setError(null);
    try {
      const newContent = editor.getText();
      
      const response = await github.saveFile(
        currentFile.owner,
        currentFile.repo,
        currentFile.path,
        newContent,
        'Update file via web editor',
        currentFile.sha
      );
      
      if (response && response.content) {
        setCurrentFile(prev => ({ 
          ...prev, 
          content: newContent,  // Use the new content directly
          sha: response.content.sha 
        }));
        setIsEditing(false);
        alert('File saved successfully!');
      } else {
        console.error('Unexpected GitHub response:', response);
        throw new Error('Unexpected response from GitHub');
      }
    } catch (error) {
      console.error('Error saving file:', error);
      setError(`Error saving file: ${error.message}. Check console for more details.`);
    }
  }, [editor, currentFile]);

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
          <div id="editor" style={{height: '400px'}}></div>
          <button onClick={saveFile}>Save</button>
          <button onClick={toggleEdit}>Cancel</button>
        </div>
      )}
    </div>
  );
}