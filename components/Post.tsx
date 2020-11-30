import { FC } from "react";
import Link from "next/link";
import axios from "axios";

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
  const deletePost = async (id) => {
    const res = await axios.delete(`/api/deletepost/${id}`);
    console.log(res);
  };

  return (
    <div>
      <h1>{post.title}</h1>
      <h3>{post.content}</h3>
      <Link href="/profile/[id]" as={`/profile/${post.creator._id}`}>
        <a>
          <p>{post.creator.name}</p>
        </a>
      </Link>
      <button onClick={() => deletePost(post._id)}>Delete</button>
    </div>
  );
};

export default Post;
