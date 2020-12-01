import { FC, useContext } from "react";
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
};

type AppProps = { post: PostType };

const Post = ({ post }: AppProps) => {
  const loggedInUser = useContext(UserContext);

  const deletePost = async (id) => {
    const res = await axios.delete(`/api/deletepost/${id}`);
    console.log(res);
  };

  console.log(loggedInUser);
  console.log(post.creator._id);
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
    </div>
  );
};

export default Post;
