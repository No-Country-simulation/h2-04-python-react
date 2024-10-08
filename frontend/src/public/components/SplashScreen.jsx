/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FlipText from "@/common/components/ui/flip-text";

function SplashScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-[#317EF4] to-[#8E2BFF]">
      <FlipText
        duration="0.9"
        delayMultiple="0.4"
        className="text-6xl font-bold -tracking-widest text-white md:text-7xl md:leading-[5rem]"
        word="WAKI"
      />
    </div>
  );
}

export function SplashScreenWrapper({ children }) {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      const timer = setTimeout(() => {
        setShowSplash(false);
        navigate("/auth");
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setShowSplash(false);
    }
  }, [location, navigate]);

  if (showSplash && location.pathname === "/") {
    return <SplashScreen />;
  }

  return children;
}
