import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabaseClient } from "../../services/supabase";

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
}

interface BlogState {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
  page: number;
  total: number;
}

const initialState: BlogState = {
  posts: [],
  loading: false,
  error: null,
  page: 1,
  total: 0,
};

//thunks

//pagination
export const fetchBlogPosts = createAsyncThunk(
  "blog/fetchPosts",
  async (
    { page, limit }: { page: number; limit: number },
    { rejectWithValue }
  ) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabaseClient
      .from("posts")
      .select("*", { count: "exact" })
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) {
      return rejectWithValue(error.message);
    }

    return { posts: data || [], total: count || 0 };
  }
);

//create blog
export const createBlogPost = createAsyncThunk(
  "blog/createPost",
  async (
    { title, content }: { title: string; content: string },
    { rejectWithValue }
  ) => {
    const { data, error } = await supabaseClient
      .from("posts")
      .insert([{ title, content }])
      .select()
      .single();

    if (error) {
      return rejectWithValue(error.message);
    }

    return data;
  }
);

//update blog
export const updateBlogPost = createAsyncThunk(
  "blog/updatePost",
  async (
    { id, title, content }: { id: number; title: string; content: string },
    { rejectWithValue }
  ) => {
    const { data, error } = await supabaseClient
      .from("posts")
      .update({ title, content })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return rejectWithValue(error.message);
    }

    return data;
  }
);

//delete blog
export const deleteBlogPost = createAsyncThunk(
  "blog/deletePost",
  async (id: number, { rejectWithValue }) => {
    const { error } = await supabaseClient.from("posts").delete().eq("id", id);

    if (error) {
      return rejectWithValue(error.message);
    }

    return id;
  }
);

//slice
const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    
      //fetch posts
      .addCase(fetchBlogPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
        state.total = action.payload.total;
      })
      .addCase(fetchBlogPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //create post
      .addCase(createBlogPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlogPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
      })

      //update post
      .addCase(updateBlogPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlogPost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.posts.findIndex(
          (post) => post.id === action.payload.id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })

      //delete post
      .addCase(deleteBlogPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlogPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter((post) => post.id !== action.payload);
      });
  },
});

export default blogSlice.reducer;