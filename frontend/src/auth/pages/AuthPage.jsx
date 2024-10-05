import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";
import { cn } from "@/lib/utils";

export const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");

  const handleSwitchToLogin = () => {
    setActiveTab("login");
  };

  return (
    <div className="h-screen mt-24 w-full min-w-fit max-w-2xl">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 rounded-none bg-white shadow-md">
          <TabsTrigger
            value="login"
            className={cn(
              "rounded-none ",
              activeTab === "login"
                ? "border-b-[3px] border-blueWaki"
                : "border-b-[3px] border-transparent"
            )}
          >
            Iniciar Sesión
          </TabsTrigger>
          <TabsTrigger
            value="register"
            className={cn(
              "rounded-none",
              activeTab === "register"
                ? "border-b-[3px] border-blueWaki"
                : "border-b-[3px] border-transparent"
            )}
          >
            Registrarse
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        <TabsContent value="register">
          <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
