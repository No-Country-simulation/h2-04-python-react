import useAuthStore from "@/api/store/authStore";
import useUserDataStore from "@/api/store/userStore";
import LanguageSelect from "@/common/components/LanguageSelect";
import { Card } from "@/common/components/ui/card";
import {
  Bolt,
  Globe,
  Heart,
  LogOut,
  Mail,
  Star,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import ProfileImage from "../components/ProfileImage";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useUserDataStore();
  const profilePhoto = user.profile_image;
  const username = user.full_name;
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <section className="py-4 mb-28">
      <div className="flex flex-row items-end justify-end pb-4">
        <button
          id="logout"
          name="logout"
          onClick={handleLogout}
          className="flex flex-row gap-1 items-center cursor-pointer text-sm mr-3"
        >
          <LogOut className="size-5 text-zinc-400" />
          <span className="sr-only">Cerrar sesión</span>
        </button>
      </div>
      <div className="flex flex-col items-center justify-center gap-1">
        <ProfileImage
          profilePhoto={profilePhoto}
          username={username}
          BASE_URL={BASE_URL}
          size="size-[134px]"
        />
        <span className="capitalize text-base font-bold">{username}</span>
      </div>
      <section className="p-2 pt-6">
        <Card className="w-full max-w-md mx-auto bg-white rounded-lg shadow-none waki-shadow border-none overflow-hidden">
          <Link to={"/predictions"}>
            <div className="flex flex-row items-center justify-between p-4 border-b">
              <div className="flex flex-row items-center justify-between space-x-4">
                <Star className="text-blueWaki" />
                <p className="text-xs ">Mis predicciones</p>
              </div>
            </div>
          </Link>

          <div className="flex flex-row items-center justify-between p-4 border-b last:border-b-0">
            <div className="flex flex-row items-center justify-between space-x-4">
              <Heart className="text-blueWaki" />
              <p className="text-xs ">Mis equipos favoritos</p>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between p-4 border-b last:border-b-0">
            <div className="flex flex-row items-center justify-between space-x-4">
              <UsersRound className="text-blueWaki" />
              <p className="text-xs ">Invitar amigos</p>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between p-4 border-b last:border-b-0">
            <div className="flex flex-row items-center justify-between space-x-4">
              <Mail className="text-blueWaki" />
              <p className="text-xs ">Mensajes</p>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between p-4 border-b last:border-b-0">
            <div className="flex flex-row items-center justify-between space-x-4">
              <UserRound className="text-blueWaki" />
              <p className="text-xs ">Informacion personal</p>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between p-4 border-b last:border-b-0">
            <div className="flex flex-row items-center justify-between space-x-4">
              <Bolt className="text-blueWaki" />
              <p className="text-xs ">Ajustes</p>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between p-4 border-b last:border-b-0">
            <div className="flex flex-row items-center justify-between space-x-4">
              <Globe className="text-blueWaki" />
              <p className="text-xs ">Idioma preferido</p>
              <LanguageSelect />
            </div>
          </div>
        </Card>
      </section>
    </section>
  );
};

export default Profile;
