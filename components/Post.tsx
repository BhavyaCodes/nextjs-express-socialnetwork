import { FC } from "react";
import Link from "next/link";

interface Creator {
  name: string;
  _id: string;
}

type Post = {
  _id: string;
  title: string;
  content: string;
  creator: Creator;
};

type AppProps = { post: Post };

const Post = ({ post }: AppProps) => {
  return (
    <div>
      <h1>{post.title}</h1>
      <h3>{post.content}</h3>
      <Link href="/profile/[id]" as={`/profile/${post.creator._id}`}>
        <a>
          <p>{post.creator.name}</p>
        </a>
      </Link>
    </div>
  );
};

export default Post;
