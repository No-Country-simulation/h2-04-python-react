import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/common/components/ui/tabs";
import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";
import { useTranslation } from "react-i18next";

export const AuthPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("login");

  const handleSwitchToLogin = () => {
    setActiveTab("login");
  };

  return (
    <div className="h-screen mt-4 w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 rounded-none bg-white shadow-md">
          <TabsTrigger
            value="login"
            className={
              "text-base font-medium data-[state=active]:text-blueWakiFix data-[state=active]:shadow-none data-[state=active]:border-b-[3px] data-[state=active]:border-blue-500 data-[state=active]:rounded-none"
            }
          >
            {t("auth.login")}
          </TabsTrigger>
          <TabsTrigger
            value="register"
            className={
              "text-base font-medium data-[state=active]:text-blueWakiFix data-[state=active]:shadow-none data-[state=active]:border-b-[3px] data-[state=active]:border-blue-500 data-[state=active]:rounded-none"
            }
          >
            {t("auth.register")}
          </TabsTrigger>
        </TabsList>
        <div className="min-w-fit max-w-2xl mx-auto">
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
