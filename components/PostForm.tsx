import { useState, FormEvent } from "react";
import axios from "axios";

function PostForm({ getPosts }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handlePostSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(title, content);
    try {
      const res = await axios.post("/api/newpost", { title, content });
      console.log(res);
    } catch (error) {
      console.log(error);
    }

    getPosts();
  };

  return (
    <form onSubmit={handlePostSubmit}>
      <label htmlFor="title">Title</label>
      <input
        id="title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <label htmlFor="content">Content</label>
      <input
        id="content"
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
        }}
      />
      <button type="submit">Post</button>
    </form>
  );
}

export default PostForm;
