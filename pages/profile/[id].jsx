import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const ProfilePage = () => {
  const { id } = useRouter().query;

  const [profile, setProfile] = useState({ user: null, loading: true });

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
      <>
        <h2>{post.title}</h2>
        <h3>{post.content}</h3>
      </>
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
