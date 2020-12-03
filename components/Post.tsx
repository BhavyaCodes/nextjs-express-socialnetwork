import { FC, useContext, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { UserContext } from "./context/user.context";
interface Creator {
  name: string;
  _id: string;
}

type PostType = {
  _id: string;
  title: string;
  content: string;
  creator: Creator;
  likeCount: number;
  likes: string[];
  liked?: boolean;
};

type AppProps = { post: PostType };

const Post = ({ post }: AppProps) => {
  const [deleted, setDeleted] = useState(false);
  const loggedInUser = useContext(UserContext);

  const deletePost = async (id) => {
    try {
      await axios.delete(`/api/deletepost/${id}`);
      setDeleted(true);
    } catch (error) {
      console.log(error);
    }
  };

  if (deleted) {
    return null;
  }

  const handleLike = async () => {};

  return (
    <div>
      <h1>{post.title}</h1>
      <h3>{post.content}</h3>
      <Link href="/profile/[id]" as={`/profile/${post.creator._id}`}>
        <a>
          <p>{post.creator.name}</p>
        </a>
      </Link>
      {loggedInUser.user?._id === post.creator._id && (
        <button onClick={() => deletePost(post._id)}>Delete</button>
      )}
      <button onClick={handleLike}>Like</button>
      <p>{post.likeCount}</p>
      {loggedInUser.user ? (
        <p>{post.liked ? "liked" : "not liked"}</p>
      ) : (
        <p>not logged in</p>
      )}
    </div>
  );
};

export default Post;
