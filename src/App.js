import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Quill from 'quill';
import Upper from './components/Upper';

function App() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [newNote, setNewNote] = useState(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (quillRef.current) {
      const editor = new Quill(quillRef.current, {
        theme: 'snow', // or 'bubble'
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['image', 'code-block'],
          ],
        },
      });
      editor.on('text-change', handleEditorChange);
    }
  }, []);

  const handleEditorChange = (delta, oldDelta, source) => {
    const content = quillRef.current.children[0].innerHTML;
    console.log('Editor content:', content);
    console.log('Editor delta:', delta);
    console.log('Editor source:', source);
  };

  const handleNoteChange = (event) => {
    const newNotes = [...notes];
    newNotes[selectedNote] = {
      ...newNotes[selectedNote],
      content: event.target.value,
    };
    setNotes(newNotes);
  };

  const handleNoteSelect = (index) => {
    setSelectedNote(index);
  };

  const handleNoteDownload = () => {
    if (selectedNote !== null) {
      const note = notes[selectedNote];
      const blob = new Blob([note.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'note.txt');
      link.click();
    }
  };

  const handleNoteTrash = () => {
    if (selectedNote !== null) {
      const updatedNotes = notes.filter((_, index) => index !== selectedNote);
      setNotes(updatedNotes);
      setSelectedNote(null);
    }
  };

  const handleNoteNew = () => {
    const newNote = {
      title: 'New Note',
      content: '',
    };
    setNewNote(newNote);
    setSelectedNote(null);
  };

  const handleSaveNote = () => {
    if (newNote) {
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      setSelectedNote(updatedNotes.length - 1);
      setNewNote(null);
    }
  };

  return (
    <>
      <div className="App">
        <div className="container">
          <div className="left-container">
            <div className="new-note-container">
              <button onClick={handleNoteNew}>+</button>
            </div>
            <div className="quick-notes-container">
              <h2>QUICK NOTES</h2>
              <h2>ALL NOTES</h2>
              <h2>FAVOURITES</h2>
              <h2>TRASH</h2>
              <ul>
                {notes.map((note, index) => (
                  <li key={index}>
                    <button onClick={() => handleNoteSelect(index)}>{note.title}</button>
                  </li>
                ))}
              </ul>
            </div>
            {/* Other note categories */}
          </div>
          <div className="right-container">
            <div className="search-bar">
              <input type="text" placeholder="Search..." />
              <button type="submit">
                <i className="fa fa-search"></i>
              </button>
            </div>
          </div>
          <div className="textarea-container">
            <div className="right-note-container">
            <div ref={quillRef} className="quill-container" />

              {newNote && (
                <div className="new-note-container">
                  <h2>New Note</h2>
                  <div ref={quillRef} style={{ height: '300px', backgroundColor: 'white' }} />
                  <button onClick={handleSaveNote}>Save</button>
                  <button onClick={handleNoteDownload}>Download</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
