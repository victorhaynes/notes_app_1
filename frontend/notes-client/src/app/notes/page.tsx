"use client"

import { deleteNote, listNotes, postNote } from "@/redux/features/noteSlice"
import { AppDispatch, RootState } from "@/redux/store"
import Link from "next/link"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
import { useForm } from "react-hook-form"
import ProtectedRoute from "../_components/ProtectedRoute"

type NoteForm = {
  title: string;
  content: string;
}

const NotesPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const notesState = useSelector((state: RootState) => state.notesState)
  const {notes, loading, error} = notesState

  useEffect(() => {
    dispatch(listNotes())
  }, [dispatch])

  const [showCreateForm, setShowCreateForm] = useState<boolean>(false)
  const form = useForm<NoteForm>();
  const register = form.register;
  const handleSubmit = form.handleSubmit;
  const reset = form.reset;
  const formErrors = form.formState.errors;

  function submitForm(data: NoteForm): void {
    dispatch(postNote({
      title: data.title,
      content: data.content
    }))

    reset()
    setShowCreateForm(false)
  }

  useEffect(() => {
    return () => {
      // form clean up so it goes away on nav
      setShowCreateForm(false)
      reset()
      }
  }, [])

  const [deleteMode, setDeleteMode] = useState<boolean>(false)

  function handleDelete(id: number): void {
    dispatch(deleteNote(id))
  }


  if (loading) return <div className="fixed inset-0 flex justify-center items-center">Fetching note...</div>
  if (error) return <div className="fixed inset-0 flex justify-center items-center text-red-800">{error}</div>

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 mt-4">
          <h1 className="font-bold text-xl mb-4">My Notes:</h1>
          <div className="flex mb-4 gap-2">
            <button className="bg-gray-300 border p-1 rounded-md hover:brightness-85 transition"
              onClick={() => setShowCreateForm(true)}
              >New Note
            </button>
            <button className="bg-gray-300 border p-1 rounded-md hover:brightness-85 transition"
              onClick={() => setDeleteMode((boolVal) => !boolVal)}
            >Delete Mode</button>
          </div>
          {/* Grid for Notes / standard display */}
          <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${showCreateForm && "opacity-50"}`}>
            {notes.map((note) => {
                return (
                  <Link key={note.id} href={`/notes/${note.id}`} className="block p-4 border rounded-md bg-amber-100 hover:brightness-90 transition">
                    <div className="flex font-bold justify-between">
                      <div>
                        {note.title}
                      </div>
                      <div>
                        {deleteMode && <button className="hover:cursor-pointer" onClick={(e) => {
                          e.preventDefault(); // remember the entire card is a link, so prevent nav/link following
                          handleDelete(note.id);
                        }}>[X]</button>}
                      </div>
                    </div>
                  </Link>
                )
              }
            )}
          </div>

        {/* New Note Form & black-out */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
            {/* fixed: fixed relative to viewport, inset-0: makes div take up entire screen */}
            <div className="bg-sky-50 p-4 rounded border">
              <form onSubmit={handleSubmit(submitForm)}>
                <div className="mb-2">
                  <label>Title</label>
                  <input type="text" className="w-full border rounded p-1 bg-white" {...register("title", {required: "Title is required."})}/>
                </div>
                <div className="mb-2">
                  <label>Content</label>
                  <textarea className="w-full border rounded p-1 h-20 bg-white" {...register("content", {required: "Content cannot be empty."})}/>
                </div>
                <div className="flex-col gap-1 mb-1 text-red-600">
                  {formErrors.title && <p>{formErrors.title.message}</p>}
                  {formErrors.content && <p>{formErrors.content.message}</p>}
                </div>
                <div className="flex gap-2">
                  <button type="button"
                    onClick={() => {
                      reset();
                      setShowCreateForm(false);
                    }}
                    className="border rounded px-2 py-1 bg-rose-200"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="border rounded px-2 py-1 bg-sky-200" disabled={loading}>{loading? "Saving..." : "Save"}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>

  )
}

export default NotesPage