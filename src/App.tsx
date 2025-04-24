import React, { useState, useEffect, FormEvent } from 'react';
import { CiSquareRemove } from "react-icons/ci";
import { TfiCheckBox } from "react-icons/tfi";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { v4 as uuidv4 } from 'uuid';
import { format, parseISO, isValid } from 'date-fns';
import './App.css';


const LOCAL_STORAGE_KEY = 'react-todo-app-notes';

type Note = {
  id: string,
  title: string,
  description: string,
  dueDate: string,
  completed: boolean,
}

function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    
    try {
      const storedNotes = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedNotes) {
        
        const parsedNotes = JSON.parse(storedNotes);
        return parsedNotes as Note[];
      } else {
        console.log("No notes found in localStorage.");
        return [];
      }

    } catch (error) {
      console.error("Failed to parse notes from localStorage: ", error);
      return [];
    }

  });

  
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes))
    } catch (Error) {
      console.error("Failed to save notes to localstorage: ", Error)
    }
  }, [notes]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() && !date && !description) {
      alert("Please fill all requarements")
      return;
    }

    // ----> add new note
    const newNote: Note = {
      id: uuidv4(),
      title: title,
      description: description,
      dueDate: date,
      completed: false
    }

    // ---> Clear form fields

    setNotes(prevNotes => [...prevNotes, newNote]);
    setTitle('');
    setDate('');
    setDescription('');
  }

  const handleRemove = (idToRemove: string): void => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== idToRemove));

  }

  const handleToggleComplete = (idToToggle: string): void => {
    setNotes(prevNotes =>
      prevNotes.map(note => {
        if (note.id === idToToggle) {
          return { ...note, completed: !note.completed }
        }
        return note;
      })
    );
  }

  const formatDate = (dateString: string): string => {
    if (!dateString) {
      return 'No Date!'
    }
    try {
      const dateObj = parseISO(dateString);
      if (!isValid(dateObj)) {
        return 'Invalid Date!'
      }

      // --- CHOOSE YOUR DESIRED FORMAT ---
      // return format(dateObj, 'MM/dd/yyyy');      // Example: 04/25/2025
      // return format(dateObj, 'MMM d, yyyy');    // Example: Apr 25, 2025
      // return format(dateObj, 'dd MMM yyyy');    // Example: 25 Apr 2025
      // return format(dateObj, 'PPP');           // Example: Apr 25th, 2025 
      return format(dateObj, "eee, MMM d");     // Example: Friday, Apr 25
    } catch (error) {
      console.error("Error parsing date: ", error)
      return dateString;
    }
  }



  return (
    <>
      <div className='container'>
        <div id='add-task'>
          <form id='form' onSubmit={handleSubmit}>
            <h1>Add to List</h1>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label htmlFor="date">Date</label>
            <input
              type="date"
              name="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button className='add-button' type='submit'>Add</button>
          </form>
        </div>
        <div id='task-lists'>
          <h1>All Tasks</h1>
          <ul>
            {notes.map((note) => (
              <li key={note.id} className={` task-item ${note.completed ? 'task-item--completed' : ''} `}>
                <div className='icons'>
                  {/** Conditional Rendering for checkbox */}
                  <button
                    onClick={() => handleToggleComplete(note.id)}
                    aria-label={note.completed ? ` Mark task incomplete: ${note.title} ` : ` Mark task complete: ${note.title} `}
                    className={`task-button ${note.completed ? 'task-button--completed' : ''}`}
                  >
                    {note.completed ? (

                      <TfiCheckBox size={24} />

                    ) : (

                      <MdCheckBoxOutlineBlank size={24} />

                    )}
                  </button>

                  <button
                    onClick={() => handleRemove(note.id)}
                    aria-label={`Remove task: ${note.title}`}
                    className='remove'
                  >
                    <CiSquareRemove className='remove' size={25} />
                  </button>
                </div>
                <div className='task-con'>
                  <div id='task-header'>
                    <h3> {note.title}</h3>
                    <h4> {formatDate(note.dueDate)} </h4>
                  </div>
                  <p> {note.description}  </p>
                </div>
              </li>
            ))}

          </ul>
        </div>
      </div>
    </>
  )
}

export default App
