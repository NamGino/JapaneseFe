
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {

    setUser(state, action) {
      state.user = action.payload
    },

   
    clearUser(state) {
      state.user = null
    },

  
    updateUser(state, action) {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload
        }
      }
    }
  }
})

export const { setUser, clearUser, updateUser } = userSlice.actions
export default userSlice.reducer
