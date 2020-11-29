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

  console.log(profile);

  return <div>Profile Page</div>;
};

export default ProfilePage;

// console.log(e.response.status);
