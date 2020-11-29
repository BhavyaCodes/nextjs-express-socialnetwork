import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const ProfilePage = () => {
  const { id } = useRouter().query;
  console.log(id);

  const [profile, setProfile] = useState({ user: null, loading: true });

  useEffect(() => {}, []);

  return <div>Profile Page</div>;
};

export default ProfilePage;
