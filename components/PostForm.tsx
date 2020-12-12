import { useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";

function PostForm({ getPosts }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<null | File>(null);
  const [fileError, setFileError] = useState("");
  const [previewSource, setPreviewSource] = useState(null);

  const handlePostSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(title, content);
    try {
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
    previewFile(file);
    if (file.size > 10485760) {
      setFileError("max file size is 10 mb");
    } else {
      setFileError("");
    }
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  return (
    <form onSubmit={handlePostSubmit}>
      <input
        type="file"
        accept=".jpg,.jpeg,.png,.gif"
        onChange={fileChangedHandler}
        multiple={false}
      />
      {previewSource && (
        <img src={previewSource} alt="chosen" style={{ width: "30%" }} />
      )}
      {fileError}
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
