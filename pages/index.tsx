import { useState, useEffect, FormEvent } from "react";
import axios from "axios";

import Post from "../components/Post";
import PostForm from "../components/PostForm";

export default function Home() {
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

  const renderPosts = () => {
    return posts.map((post) => <Post key={post._id} post={post} />);
  };

  return (
    <div>
      <h1>Index page</h1>
      <PostForm getPosts={getPosts} />
      <div>{renderPosts()}</div>
    </div>
  );
}
