import { FC } from "react";
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
      <p>{post.creator.name}</p>
    </div>
  );
};

export default Post;
