import React, { useState, useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export default function Editor() {
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    if (editor === null) {
      const quill = new Quill('#editor', {
        theme: 'snow'
      });
      setEditor(quill);
    }
  }, []);

  return (
    <div>
      <div id="editor" style={{height: '400px'}}></div>
      <button onClick={() => console.log(editor.getText())}>Save</button>
    </div>
  );
}