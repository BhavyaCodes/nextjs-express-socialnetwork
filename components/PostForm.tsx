import { useState, useRef, FormEvent, ChangeEvent } from "react";
import axios from "axios";

function PostForm({ getPosts }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [fileError, setFileError] = useState("");
  const [previewSource, setPreviewSource] = useState(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setTitle("");
    setContent("");
    fileRef.current.value = "";
    setPreviewSource(null);
  };

  const handlePostSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      if (fileRef.current?.files[0]) {
        fd.append("image", fileRef.current?.files[0]);
      }
      fd.append("title", title);
      fd.append("content", content);
      await axios.post("/api/newpost", fd, {
        onUploadProgress: (progressEvent) => {
          console.log(
            `Upload Progress ${Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            )}%`
          );
        },
      });
      resetForm();
    } catch (error) {
      console.log(error);
    }

    getPosts();
  };

  const fileChangedHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const file = fileRef.current.files[0];
    if (!file) {
      setPreviewSource(null);
      return;
    }
    previewFile(file);
    if (file.size > 10485760) {
      setFileError("max file size is 10 mb");
    } else {
      setFileError("");
    }
  };

  const previewFile = (file: Blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const clearImage = () => {
    setPreviewSource(null);
    fileRef.current.value = "";
  };

  return (
    <form onSubmit={handlePostSubmit}>
      <input
        type="file"
        accept=".jpg,.jpeg,.png,.gif"
        onChange={fileChangedHandler}
        multiple={false}
        ref={fileRef}
      />
      {previewSource && (
        <>
          <img src={previewSource} alt="chosen" style={{ width: "30%" }} />
          <button type="button" onClick={clearImage}>
            Remove image
          </button>
        </>
      )}
      {fileError}
      <label htmlFor="title">Title</label>
      <input
        id="title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        required
      />
      <label htmlFor="content">Content</label>
      <input
        id="content"
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
        }}
        required
      />
      <button type="submit">Post</button>
    </form>
  );
}

export default PostForm;
