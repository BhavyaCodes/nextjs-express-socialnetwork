import { useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handlePostSubmit = (e) => {
    e.preventDefault();
    console.log(title, content);
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
    </div>
  );
}
