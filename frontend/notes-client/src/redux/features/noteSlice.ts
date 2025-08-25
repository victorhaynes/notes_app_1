import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosAuthenticated } from "@/app/_utils/axios";
import { ApiContext } from "@reduxjs/toolkit/query";
import handleResponseError from "@/app/_utils/axios_error_handling";
import { get } from "http";

// -- Types --
// -- match the shape of the Note-READ serializer in Django
type Note = {
  id: number;
  title: string;
  content: string;
  owner: number;
  created_at: string;
  updated_at: string;
}

type NoteState = {
  notes: Note[];
  selectedNote: null | Note
  loading: boolean;
  error: string | null;
  // Optionally, if I wanted per-action UI feedback I could have:
  // creating: boolean;
  // updating: boolean;
  // deleting: boolean;
  // --- but just loading will suffice.
  //   And do something like this in the UI:
  // { noteState.creating && <p>Saving your note...</p> }
  // { noteState.updating && <p>Updating note...</p> }
  // { noteState.deleting && <p>Deleting note...</p> }
}

// -- Initial State
const initialState: NoteState = {
  notes: [],
  selectedNote: null,
  loading: false,
  error: null
}

// -- Thunks -- define your how your payloads are constructed
export const postNote = createAsyncThunk<
  Note,
  {"owner": number, "title": string, "content": string},
  {rejectValue: string}
  >("note/create",
    async (noteData, {rejectWithValue}) => {
      try {
        const response = await axiosAuthenticated.post<Note>("/notes/", noteData)
        return response.data
      } catch (error: any){
        const errorBody = error.response?.data
        const errorMessages = handleResponseError(error)
        return rejectWithValue(errorMessages)      
      }
    }
)

export const listNotes = createAsyncThunk<
  Note[],
  void,
  {rejectValue: string}
  >("note/list",
    async(_, { rejectWithValue }) => {
      try {
        const response = await axiosAuthenticated.get<Note[]>("/notes/")
        console.log(response)
        return response.data
      } catch (error: any){
        console.log(error)
        const errorMessages = handleResponseError(error)
        return rejectWithValue(errorMessages)
      }
    }
  )

export const testThunk = createAsyncThunk<
  object,
  void,
  { rejectValue: string }
>("note/test",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosAuthenticated.get<object>("/test/")
      console.log(response)
      return response.data
    } catch (error: any) {
      console.log(error)
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
      const response = await axiosAuthenticated.get<Note>(`/notes/${noteId}`)
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
      const response = await axiosAuthenticated.put<Note>(`/notes/${newNoteData.id}/`, newNoteData)
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
      return undefined // could also return the noteId so the slice has easier access, but not necessary
    } catch (error: any) {
      const errorMessages = handleResponseError(error)
      return rejectWithValue(errorMessages)
    }
  }
)

// -- Slice
const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      // -- Get Note
      .addCase(getNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNote.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedNote = action.payload
      })
      .addCase(getNote.rejected, (state, action) => {
        state.loading = false;
        // -- The '??' is necessary becasue the rejectWith payload (action.payload) return value is explicitly a string OR undefined. 
        // -- Even though it should not ever get used, either special case that here or add undefined as a valid option to your type
        // -- I explicitly call the rejectWithValue function in my thunks but TS doesn't know that....thus this check.
        // -- You can also cast the (action.payload as string)
        state.error = action.payload ?? "Failed to get note.";
      })
      // -- List Notes
      .addCase(listNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload
      })
      .addCase(listNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to get notes.";
      })
      // -- Post Notes
      .addCase(postNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes.push(action.payload) // append new note to master list
        state.selectedNote = action.payload // set the selected note also
      })
      .addCase(postNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to post note.";
      })
      // -- Patch Note
      .addCase(patchNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(patchNote.fulfilled, (state, action) => {
        state.loading = false;
        // -- keep this outside the conditional because if a user navs directly to /notes/n/, depending on the UI logic, the master list may never get populated, so it could never get found in the .findIndex() method
        // -- good practice to decouple these
        state.selectedNote = action.payload
        
        // -- Find the index of the old note
        // -- Remembr: benefit of using .findIndex() over .filter() is we don't need to create a copy of the array, just in place modificaiton so O(1) space not O(n). O(n) time still.
        const index = state.notes.findIndex((individualNote) => {
          return individualNote.id === action.payload.id
        })
        if (index !== -1){ // -- if match, replace in array also
          state.notes[index] = action.payload
        }
      })
      .addCase(patchNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update (PATCH) note.";
      })
      // -- Put Note
      .addCase(putNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(putNote.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedNote = action.payload
        const index = state.notes.findIndex((individualNote) => {
          return individualNote.id === action.payload.id
        })
        if (index !== -1) {
          state.notes[index] = action.payload
        }
      })
      .addCase(putNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update (PUT) note.";
      })
      // -- Delete Note
      .addCase(deleteNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedNote = null
        const removalIndex = action.meta.arg // -- This is the 'number' variable we pass into dispatch(deleteNote(1))
        state.notes = state.notes.filter((individualNote) => {
          if (individualNote.id === removalIndex){
            return false
          } else {
            return true
          }
        })
        // -- or more succintly, state.notes = state.notes.filter(n => n.id !== removalIndex)
      })
  }
})

export default noteSlice.reducer

// -- For the future, if you want to get real optimal you can use a type structure of
// -- a POJO of id: POJO for CRUD where the nested POJO is the Note object like this:
// type NoteState = {
//   byId: Record<number, Note>;
//   allIds: number[];
//   selectedId: number | null;
//   loading: boolean;
//   error: string | null;
// }
// --
// state.byId = {
//   1: { id: 1, title: "A", content: "..." },
//   2: { id: 2, title: "B", content: "..." },
// }
// --
// const notes = useSelector(state => state.notes);

// return (
//   <ul>
//   {
//     notes.allIds.map(id => {
//       const note = notes.byId[id];
//       return <li key={ note.id }> { note.title } </li>;
//     })
//   }
//   </ul>
// );
