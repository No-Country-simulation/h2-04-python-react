/* eslint-disable react/prop-types */
import { Camera, Loader2 } from "lucide-react";
import ProfileImage from "./ProfileImage";
import useAuthStore from "@/api/store/authStore";
import useUserDataStore from "@/api/store/userStore";
import {
  useIsMutating,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchData } from "@/api/services/fetchData";
import { useEffect, useState } from "react";

const ProfileImageUploader = ({
  profilePhoto,
  username,
  userId,
  onUpdateSuccess,
}) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setUserData = useUserDataStore((state) => state.setUserData);
  const queryClient = useQueryClient();
  const isMutating = useIsMutating();
  const [isLoading, setIsLoading] = useState(false);

  const updateProfileMutation = useMutation({
    mutationFn: (formData) => {
      return fetchData(`user/${userId}/`, "PATCH", formData, accessToken);
    },
    onSuccess: async (result) => {
      const newPhotoUrl = result.data.profile_image;
      onUpdateSuccess(newPhotoUrl);
      await fetchUpdatedUserData();
    },
    onError: (error) => {
      console.error("Error updating profile photo:", error);
    },
  });

  useEffect(() => {
    setIsLoading(updateProfileMutation.isLoading || isMutating > 0);
  }, [updateProfileMutation.isLoading, isMutating]);

  const fetchUpdatedUserData = async () => {
    try {
      const userData = await fetchData("user/me/", "GET", null, accessToken);
      setUserData(userData);
      queryClient.invalidateQueries("userData");
    } catch (error) {
      console.error("Error fetching updated user data:", error);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_image", file);

    updateProfileMutation.mutate(formData);
  };

  return (
    <div className="relative">
      <ProfileImage
        profilePhoto={profilePhoto}
        username={username}
        size="size-32 "
      />
      <label
        htmlFor="profile-photo-upload"
        className="absolute bottom-0 right-0 bg-blueWaki rounded-full size-8 p-2 shadow-md cursor-pointer"
      >
        <Camera className="size-4 text-white" />
        <input
          id="profile-photo-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isLoading}
        />
      </label>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
          <Loader2 className="size-8 text-white animate-spin" />
        </div>
      )}
    </div>
  );
};

export default ProfileImageUploader;
