import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Post from "../../components/Post";

interface Creator {
  name: string;
  _id: string;
}

type Post = {
  title: string;
  content: string;
  _id: string;
  creator: Creator;
};

type Profile = {
  loading: boolean;
  user: {
    name: string;
    imageUrl: string;
    posts: Post[];
  } | null;
};

const ProfilePage = () => {
  const { id } = useRouter().query;

  const [profile, setProfile] = useState<Profile>({
    user: null,
    loading: true,
  });

  useEffect(() => {
    if (!id) {
      return;
    }
    const getProfile = async () => {
      try {
        const res = await axios.get(`/api/profile/${id}`);
        setProfile({ user: res.data, loading: false });
      } catch (e) {
        console.log(e.response.status);
      }
    };
    getProfile();
  }, [id]);

  const renderPosts = () => {
    return profile.user.posts.map((post) => (
      <Post post={post} key={post._id} />
    ));
  };

  console.log(profile);

  return (
    <div>
      {profile.loading && <h2>Loading</h2>}
      <div>
        {profile.user && (
          <>
            <img src={profile.user.imageUrl} />
            <h2>{profile.user.name}</h2>
            {renderPosts()}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

// console.log(e.response.status);
