"use client"

import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { AppDispatch, RootState } from "@/redux/store"
import { useParams } from "next/navigation"
import { getNote } from "@/redux/features/noteSlice"

const NoteDetailPage = () => {
 const dispatch = useDispatch<AppDispatch>()
 const noteId = useParams<{id: string}>().id

 const noteState = useSelector((state: RootState) => state.notesState)
 const highlightedNote = noteState.highlightedNote
 const loading = noteState.loading
 const error = noteState.loading

 useEffect(() => {
  if (noteId){
    dispatch(getNote(noteId))
  }
 },[dispatch, noteId])
  
 if (loading) return <div>Fetching note...</div>
 if (error) return <div>{error}</div>
 if (!highlightedNote) return <div>Note not found.</div>

 return (
   <div className="max-w-7xl mx-auto px-4 mt-4">
     <div className="block p-4 border rounded-md bg-amber-100">
       <h1 className="font-semibold text-lg mb-4 pb-4 border-b border-amber-300">{highlightedNote.title}</h1>
       <div className="flex mb-4 gap-2">
         <button className="bg-gray-300 border p-1 rounded-md hover:brightness-85 transition">Edit Note</button>
         <button className="bg-gray-300 border p-1 rounded-md hover:brightness-85 transition">Delete Note</button>
       </div>
       <div>{highlightedNote.content}</div>
    </div>
  </div>
 )

}

export default NoteDetailPage