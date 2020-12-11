import { useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";

function PostForm({ getPosts }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<null | File>(null);

  const handlePostSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(title, content);
    try {
      // const res = await axios.post("/api/newpost", { title, content });
      // console.log(res);
      const fd = new FormData();
      if (selectedFile) {
        fd.append("image", selectedFile);
      }
      fd.append("title", title);
      fd.append("content", content);
      const res = await axios.post("/api/newpost", fd, {
        onUploadProgress: (progressEvent) => {
          console.log(
            `Upload Progress ${Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            )}%`
          );
        },
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }

    getPosts();
  };

  const fileChangedHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    console.log(file);
  };

  return (
    <form onSubmit={handlePostSubmit}>
      <label htmlFor="title">Title</label>
      <input type="file" onChange={fileChangedHandler} />
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
