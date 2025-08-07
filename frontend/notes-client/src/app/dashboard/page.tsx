"use client"

import React from 'react'
import { useNotes } from '../_context/NotesContext'

const DashBoardPage = () => {
  const { notes, fetchNotes } = useNotes();

  return (
    <div>
      <h2>DashBoardPage</h2>
      <ul>
        {notes.map((note) => {
          return <li>{note.title}</li>
        })}
      </ul>
    </div>
  )
}

export default DashBoardPage