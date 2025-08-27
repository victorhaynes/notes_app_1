"use client"

import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { AppDispatch, RootState } from "@/redux/store"
import { useParams } from "next/navigation"
import { getNote, deleteNote, patchNote } from "@/redux/features/noteSlice"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import ProtectedRoute from "@/app/_components/ProtectedRoute"

type EditForm = {
  title: string;
  content: string;
}

type PartialNote = {
  // remember this type alone cannot prevent empty data being sent, need runtime validation
  title?: string;
  content?: string;
}

const NoteDetailPage = () => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const noteId = parseInt(useParams<{id: string}>().id)

  const noteState = useSelector((state: RootState) => state.notesState)
  const highlightedNote = noteState.highlightedNote
  const loading = noteState.loading
  const error = noteState.error

  const [showEditForm, setShowEditForm] = useState<boolean>(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: highlightedNote?.title || "",
      content: highlightedNote?.content || ""
    }
  })

  // This is a general hydration useEffect
  useEffect(() => {
  if (noteId){
    dispatch(getNote(noteId))
  }
  },[dispatch, noteId])

  // This useEffect is specifically for react-hook-forms to work correctly with defaultValues
  // defaultValues are only read once, so if you hard refresh you need to hydrate the defaultValues
  useEffect(() => {
    if (highlightedNote){
      reset({
        title: highlightedNote.title,
        content: highlightedNote.content
      })
    }
  }, [highlightedNote, reset])

  function handleEdit(data: PartialNote): void {
    // early return is not explicitly necessary, by TS can't be certain that highLightedNote.id will be defined (but the JS-logic is sound)
    if (!highlightedNote) return

    dispatch(patchNote({"id": highlightedNote.id, ...data}))
    reset()
    setShowEditForm(false)

  }


  if (loading) return <div className="fixed inset-0 flex justify-center items-center">Fetching note...</div>
  if (error) return <div className="fixed inset-0 flex justify-center items-center text-red-800">{error}</div>
  if (!highlightedNote) return <div className="fixed inset-0 flex justify-center items-center text-amber-800">Note not found.</div>

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 mt-4">
        <div className="block p-4 border rounded-md bg-amber-100">
          <h1 className="font-semibold text-lg mb-4 pb-4 border-b border-amber-300">{highlightedNote.title}</h1>
            <div className="flex mb-4 gap-2">
              <button className="bg-gray-300 border p-1 rounded-md hover:brightness-85 transition"
                onClick={()=>setShowEditForm(boolVal=>!boolVal)}
              >Edit Note</button>
              <button className="bg-gray-300 border p-1 rounded-md hover:brightness-85 transition"
                onClick={() => {
                  dispatch(deleteNote(highlightedNote.id))
                  router.push("/notes")
                }}
                >
                  Delete Note
              </button>
            </div>
            <div>{highlightedNote.content}</div>
        </div>
      </div>

      {/* Edit form & black-out */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
          <div className="bg-sky-50 p-4 rounded border">
            <form onSubmit={handleSubmit(handleEdit)}>
              <div className="mb-2">
                <label>Title</label>
                <input type="text" className="w-full border rounded p-1 bg-white" {...register("title", { required: "Title is required." })} />
              </div>
              <div className="mb-2">
                <label>Content</label>
                <textarea className="w-full border rounded p-1 h-20 bg-white" {...register("content", { required: "Content cannot be empty." })}/>
              </div>
              <div className="flex-col gap-1 mb-1 text-red-600">
                {errors.title && <p>{errors.title.message}</p>}
                {errors.content && <p>{errors.content.message}</p>}
              </div>
              <div className="flex gap-2">
                <button type="button"
                  onClick={() => {
                    reset();
                    setShowEditForm(false);
                  }}
                  className="border rounded px-2 py-1 bg-rose-200"
                >
                  Cancel
                </button>
                <button type="submit" className="border rounded px-2 py-1 bg-sky-200" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProtectedRoute>
  )
}

export default NoteDetailPage