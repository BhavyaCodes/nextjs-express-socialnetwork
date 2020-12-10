import { useState, useEffect, FormEvent } from "react";
import axios from "axios";

import Post from "../components/Post";

export default function Home() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    try {
      const res = await axios.get("/api/posts");
      console.log(res.data);
      setPosts(res.data.posts);
    } catch (error) {
      console.log(error);
    }
  };

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

  const renderPosts = () => {
    return posts.map((post) => <Post key={post._id} post={post} />);
  };

  return (
    <div>
      <h1>Index page</h1>
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
      <div>{renderPosts()}</div>
    </div>
  );
}
