"use client"

import { listNotes } from "@/redux/features/noteSlice"
import { AppDispatch, RootState } from "@/redux/store"
import App from "next/app"
import Link from "next/link"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

const NotesPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const notesState = useSelector((state: RootState) => state.notesState)
  const {notes, loading, error} = notesState

  useEffect(() => {
    dispatch(listNotes())
  }, [])

  if(loading){
    return <div>Fetching your notes...</div>
  }

  if(error){
    return <div>{error}</div>
  }

  return (
    <div>
      <h2>These are your notes</h2>
      <Link href={"/notes/1"}>Test</Link>
      {notes.map((note) => {
        return (
          <div>
            <div>{note.id}</div>
          </div>
        )
      })}
    </div>
  )
}

export default NotesPage