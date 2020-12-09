import { FC, useContext, useState, FormEvent } from "react";
import Link from "next/link";
import axios from "axios";
import { UserContext, SetUserContext } from "./context/user.context";

import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import IconButton from "@material-ui/core/IconButton";

interface Creator {
  name: string;
  _id: string;
}

type Comment = {
  _id: string;
  creator: Creator;
  content: string;
  createdAt: Date;
};

export type PostType = {
  _id: string;
  title: string;
  content: string;
  creator: Creator;
  likeCount: number;
  likes: string[];
  liked?: boolean;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
};

type AppProps = { post: PostType };

const Post: FC<AppProps> = (props: AppProps) => {
  const [deleted, setDeleted] = useState(false);
  const [post, setPost] = useState<PostType>(props.post);
  const [updating, setUpdating] = useState(false);
  const [newComment, setComment] = useState("");

  const loggedInUser = useContext(UserContext);
  const setLoggedInUser = useContext(SetUserContext);

  const deletePost = async (id: string) => {
    try {
      await axios.delete(`/api/deletepost/${id}`);
      setDeleted(true);
      const user = await axios.get("/api/current_user");
      setLoggedInUser({ user: user.data, loading: false });
    } catch (error) {
      console.log(error);
    }
  };

  if (deleted) {
    return null;
  }

  const handleLike = async () => {
    setUpdating(true);
    try {
      const res = await axios.post("/api/like", { postId: post._id });
      setPost(res.data);
      const user = await axios.get("/api/current_user");
      setLoggedInUser({ user: user.data, loading: false });
    } catch (error) {
      console.log(error);
    }
    setUpdating(false);
  };

  const handleUnlike = async () => {
    setUpdating(true);
    try {
      const res = await axios.post("/api/unlike", { postId: post._id });
      setPost(res.data);
      const user = await axios.get("/api/current_user");
      setLoggedInUser({ user: user.data, loading: false });
    } catch (error) {
      console.log(error);
    }
    setUpdating(false);
  };

  const renderLikeText = () => (
    <>
      {post.likeCount !== 0 && (
        <span>{`${post.likeCount} ${
          post.likeCount > 1 ? "likes" : "like"
        }`}</span>
      )}
    </>
  );

  const handleSubmitComment = async (e: FormEvent) => {
    e.preventDefault();
    console.log(newComment);
    const res = await axios.post("/api/addcomment", {
      postId: post._id,
      content: newComment,
    });
    setPost(res.data);
  };

  const handleDeleteComment = async (commentId: string) => {
    const res = await axios.post(`/api/deletecomment/${post._id}/${commentId}`);
    setPost(res.data);
  };

  const renderComments = () =>
    post.comments.map((comment) => (
      <div key={comment._id}>
        <p>{comment.content}</p>
        <p>{new Date(comment.createdAt).toLocaleString()}</p>
        {(loggedInUser?.user?._id === comment.creator._id ||
          loggedInUser?.user?._id === post.creator._id) && (
          <button
            onClick={() => {
              handleDeleteComment(comment._id);
            }}
          >
            Delete comment
          </button>
        )}
      </div>
    ));

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
        <>
          <button onClick={() => deletePost(post._id)}>Delete</button>
        </>
      )}
      {loggedInUser.user && (
        <>
          {loggedInUser?.user?.likes?.includes(post._id) ? (
            <>
              <IconButton
                disabled={updating}
                color="secondary"
                onClick={handleUnlike}
              >
                <ThumbUpIcon />
              </IconButton>
              {renderLikeText()}
            </>
          ) : (
            <>
              <IconButton
                disabled={updating}
                color="default"
                onClick={handleLike}
              >
                <ThumbUpIcon />
              </IconButton>
              {renderLikeText()}
            </>
          )}
        </>
      )}

      <div>{!loggedInUser.user && renderLikeText()}</div>
      <p>{new Date(post.createdAt).toLocaleString()}</p>
      <h2>Comments</h2>
      {renderComments()}
      <form onSubmit={handleSubmitComment}>
        <label>Comment</label>
        <input
          placeholder="Add a new comment"
          type="text"
          value={newComment}
          onChange={(e) => {
            setComment(e.target.value);
          }}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Post;
