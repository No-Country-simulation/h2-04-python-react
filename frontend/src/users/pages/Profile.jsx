import useAuthStore from "@/api/store/authStore";
import useUserDataStore from "@/api/store/userStore";
import LanguageSelect from "@/common/components/LanguageSelect";
import { Card } from "@/common/components/ui/card";
import {
  Bell,
  Bolt,
  CreditCard,
  Globe,
  LogOut,
  Mail,
  Star,
  UserRound,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import ProfileImageUploader from "../components/ProfileImageUploader";
import { soccerField, subtract, whistle } from "@/common/assets";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/common/components/ui/dialog";

const Profile = () => {
  const { t } = useTranslation();
  const { user, setUserData } = useUserDataStore();
  const username = user.full_name;
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const count = 0;

  const handleUpdateSuccess = (newPhotoUrl) => {
    if (user) {
      setUserData({ data: { ...user, profile_image: newPhotoUrl } });
    }
  };

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
        <ProfileImageUploader
          profilePhoto={user.profile_image}
          username={username}
          userId={user.id}
          onUpdateSuccess={handleUpdateSuccess}
        />
        <span className="capitalize text-base font-bold">{username}</span>
        
        <div className="flex flex-row space-x-8 items-center pt-4">
          <div className="flex flex-row items-center gap-1">
            <img
              src={subtract}
              alt="subtract icon"
              width={28}
              height={28}
              className="size-7 object-cover"
            />
            <span>0</span>
          </div>
          <Dialog>
            <DialogTrigger className="relative flex size-10 items-center justify-center rounded-lg ">
              <Bell className="size-7 text-purpleWaki" />
              {count > 0 && (
                <div className="absolute right-1 top-1 z-20 size-4 rounded-full bg-purpleWaki flex items-center justify-center p-1">
                  <span className="text-white text-xs font-semibold">
                    {count}
                  </span>
                </div>
              )}
            </DialogTrigger>
            <DialogContent align="end" className="w-80 rounded-[9px] p-3 text-center">
              <DialogHeader>
                <DialogTitle className="text-left">{t("notifications.notificationTitle")}</DialogTitle>
                <DialogDescription className="hidden"></DialogDescription>
              </DialogHeader>
              {t("notifications.empty")}
            </DialogContent>
          </Dialog>
          <Link to={"/profile/buy-predictions"}>
          <CreditCard className="size-7 text-purpleWaki" />
          </Link>
        </div>
      </div>
      <section className="p-2 pt-6">
        <Card className="w-full max-w-md mx-auto bg-white rounded-lg shadow-none waki-shadow border-none overflow-hidden">
          <Link to={"/profile/my-predictions"}>
            <div className="flex flex-row items-center justify-between p-4 border-b">
              <div className="flex flex-row items-center justify-between space-x-4">
                <Star strokeWidth={1.5} className="text-purpleWaki size-6" />
                <p className="text-xs ">{t("profile.myPredictions")}</p>
              </div>
            </div>
          </Link>

          <div className="flex flex-row items-center justify-between p-4 border-b last:border-b-0">
            <div className="flex flex-row items-center justify-between space-x-4">
              <img
                src={soccerField}
                alt="Soccer Field icon"
                className="w-6 h-auto object-cover"
              />
              <p className="text-xs ">{t("profile.favoriteTeams")}</p>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between p-4 border-b last:border-b-0">
            <div className="flex flex-row items-center justify-between space-x-4">
              <img
                src={whistle}
                alt="Whistle icon"
                className="w-6 h-auto object-cover"
              />
              <p className="text-xs ">{t("profile.friends")}</p>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between p-4 border-b last:border-b-0">
            <div className="flex flex-row items-center justify-between space-x-4">
              <Mail strokeWidth={1.5} className="text-purpleWaki" />
              <p className="text-xs ">{t("profile.messages")}</p>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between p-4 border-b last:border-b-0">
            <div className="flex flex-row items-center justify-between space-x-4">
              <UserRound strokeWidth={1.5} className="text-purpleWaki" />
              <p className="text-xs ">{t("profile.information")}</p>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between p-4 border-b last:border-b-0">
            <div className="flex flex-row items-center justify-between space-x-4">
              <Bolt strokeWidth={1.5} className="text-purpleWaki" />
              <p className="text-xs ">{t("profile.settings")}</p>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between p-4 border-b last:border-b-0">
            <div className="flex flex-row items-center justify-between space-x-4">
              <Globe strokeWidth={1.5} className="text-purpleWaki" />
              <p className="text-xs ">{t("profile.language")}</p>
              <LanguageSelect />
            </div>
          </div>
        </Card>
      </section>
    </section>
  );
};

export default Profile;
