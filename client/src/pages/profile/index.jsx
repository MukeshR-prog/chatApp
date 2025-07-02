import { useAppStore } from "@/store";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { ADD_PROFILE_ROUTE, HOST, REMOVE_PROFILE_ROUTE, UPDATE_PROFILE_ROUTE } from "@/utils/constants";
const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const fileInputRef = useRef(null);
  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
      if (userInfo.image){
      setImage(`${HOST}/${userInfo.image}`);
      }
    }
  },[userInfo])
  const validateProfile = ()=>{
    if (!firstName || !lastName) {
      toast.error("First name and last name are required");
      return false;
    }
    return true;
  }
  const saveChanges = async () => {
     if(validateProfile()) {
      try {
        const res = await apiClient.post(UPDATE_PROFILE_ROUTE,{firstName,lastName,color:selectedColor},{withCredentials:true})
        if (res.status === 200 && res.data) {
          setUserInfo({ ...res.data });
          toast.success("Profile updated successfully");
          navigate("/chat");
        }
      } catch (error) {
        console.error(error);
      } 
     }
  };
  const handleNavigate =() => {
    if(userInfo.profileSetup){
      navigate("/chat");
    }
    else{
      toast.error("Please complete your profile setup ");
    }
  }
  const handleFileInput =() => {
    fileInputRef.current.click();
  }
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if(file){
      console.log(file);
      const formData = new FormData();
      formData.append("profile-image", file);
      const res = await apiClient.post(ADD_PROFILE_ROUTE, formData, {
        withCredentials: true,
      });
      if (res.status === 200 && res.data.image) {
        setUserInfo({...userInfo, image:res.data.image});
        toast.success("Profile image updated successfully");
      }
    }
  };
  const handleDeleteImage = async () => {
    try {
      const res = await apiClient.delete(REMOVE_PROFILE_ROUTE,{
        withCredentials:true
      })
      if (res.status === 200) {
        setUserInfo({...userInfo, image:null});
        toast.success("Profile image deleted successfully");
        setImage(null);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div>
          <IoArrowBack onClick={handleNavigate} className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center "
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                    selectedColor
                  )}`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full ring-fuchsia-50"
              onClick={image ? handleDeleteImage : handleFileInput}
              >
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input
              name="profile-image"
              type="file"
              accept=".png, .jpg, .jpeg, .svg, .webp"
              className="hidden"
              onChange={handleImageChange}
              ref={fileInputRef}/>
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                className="p-6 rounded-lg bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Firsr Name"
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                className="p-6 rounded-lg bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Last Name"
                type="text"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                className="p-6 rounded-lg bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full flex gap-5">
              {colors.map((color, index) => (
                <div
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                    selectedColor === index ? "outline-2 outline-white/50 " : ""
                  }`}
                  key={index}
                  onClick={() => setSelectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button
            className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
            onClick={saveChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;