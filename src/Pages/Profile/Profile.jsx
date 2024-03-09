import { Box, Button, Typography, Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { database } from "../../Firebase/Firebase";
import { useAuthContext } from "../../Providers/AuthProvider";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const { user } = useAuthContext();

  useEffect(() => {

  },[])

  const getProfileData = async () => {
    const snapshot = await getDoc(doc(database, "users", user.uid));
    let data = snapshot.data();
    setProfileData(data);
    console.log(user);
  };

  useEffect(() => {
    getProfileData();
  }, []);

  return (
    <Box 
      sx={{ 
        backgroundColor: "#ffffff", 
        height: "100vh", 
        width: "100%", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        p: 4, 
        gap: 2 
      }}
    >
      <Typography variant="h4" component="div" gutterBottom>
        Profile Details
      </Typography>
      <Avatar 
        src={user.photoURL || 'https://cdn.pixabay.com/photo/2017/01/10/03/54/avatar-1968236_1280.png'} 
        alt="Profile" 
        sx={{ width: 150, height: 150, mb: 2 }} 
      />
      <Typography variant="h5" component="div" gutterBottom>
        {user.displayName || "Anonymous"}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {user.email || "Email not provided"}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {`Is Anonymous: ${user.isAnonymous ? "Yes" : "No"}`}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {`Phone Number: ${user.phoneNumber || "Phone number not provided"}`}
      </Typography>
    </Box>
  );
};

export default ProfilePage;
