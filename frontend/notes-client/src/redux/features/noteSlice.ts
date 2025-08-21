import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosAuthenticated } from "@/app/_utils/axios";
import { ApiContext } from "@reduxjs/toolkit/query";
import handleResponseError from "@/app/_utils/axios_error_handling";

// -- Types --
// -- match the shape of the Note-READ serializer in Django
type Note = {
  id: number;
  title: string;
  content: string;
  owner: number;
  created_at: string;
  updateD_at: string;
}

type NoteState = {
  notes: Note[] | [];
  loading: boolean;
  error: string | null;
}

// -- Initial State
const initialState: NoteState = {
  notes: [],
  loading: false,
  error: null
}

// -- Thunks -- define your how your payloads are constructed
export const postNewNote = createAsyncThunk<
  Note,
  {"owner": number, "title": string, "content": string},
  {rejectValue: string}
  >("note/create",
    async (noteData, {rejectWithValue}) => {
      try {
        const response = await axiosAuthenticated.post<Note>("api/notes/", noteData)
        return response.data
      } catch (error: any){
        const errorBody = error.response?.data
        const errorMessages = handleResponseError(error)
        return rejectWithValue(errorMessages)      
      }
    }
)

export const getAllNotes = createAsyncThunk<
  Note[],
  void,
  {rejectValue: string}
  >("note/list",
    async(_, { rejectWithValue }) => {
      try {
        const response = await axiosAuthenticated.get<Note[]>("api/notes/")
        return response.data
      } catch (error: any){
        const errorMessages = handleResponseError(error)
        return rejectWithValue(errorMessages)
      }
    }
  )

export const getNote = createAsyncThunk<
  Note,
  number,
  { rejectValue: string }
>("note/read",
  async (noteId, { rejectWithValue }) => {
    try {
      const response = await axiosAuthenticated.get<Note>(`api/notes/${noteId}`)
      return response.data
    } catch (error: any) {
      const errorMessages = handleResponseError(error)
      return rejectWithValue(errorMessages)
    }
  }
)

export const putNote = createAsyncThunk<
  Note,
  Note,
  { rejectValue: string }
>("note/put",
  async (newNoteData, { rejectWithValue }) => {
    try {
      const response = await axiosAuthenticated.put<Note>(`api/notes/${newNoteData.id}/`, newNoteData)
      return response.data
    } catch (error: any) {
      const errorMessages = handleResponseError(error)
      return rejectWithValue(errorMessages)
    }
  }
)
// -- note the syntax for the shape of the partial data, could also write this as:
// { id: number; data: Partial<Omit<Note, "id", "created_at", "updated_at">> }
export const patchNote = createAsyncThunk<
  Note,
  {"id": number, "data": {owner?: number, title?: string, content?: string}},
  { rejectValue: string }
>("note/patch",
  async (newNoteData, { rejectWithValue }) => {
    try {
      const response = await axiosAuthenticated.patch<Note>(`api/notes/${newNoteData.id}/`, newNoteData.data)
      return response.data
    } catch (error: any) {
      const errorMessages = handleResponseError(error)
      return rejectWithValue(errorMessages)
    }
  }
)

export const deleteNote = createAsyncThunk<
  void,
  number,
  { rejectValue: string }
>("note/delete",
  async (noteId, { rejectWithValue }) => {
    try {
      const response = await axiosAuthenticated.delete(`api/notes/${noteId}/`)
      return undefined
    } catch (error: any) {
      const errorMessages = handleResponseError(error)
      return rejectWithValue(errorMessages)
    }
  }
)