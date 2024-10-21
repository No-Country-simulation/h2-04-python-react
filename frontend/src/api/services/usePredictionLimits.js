import { useState, useEffect } from 'react';
import useUserDataStore from "@/api/store/userStore";
import useAuthStore from "@/api/store/authStore";

export function usePredictionLimits() {
  const { user } = useUserDataStore();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [limits, setLimits] = useState({
    dailyLimit: 5,
    consecutiveDaysLimit: 2,
    usedToday: 0,
    usedConsecutiveDays: 0,
  });

  useEffect(() => {
    // Simulamos la respuesta de la API
    const simulateAPIResponse = () => {
      return {
        usedToday: 3, // simulamos que hemos usando 3 predicciones hoy
        usedConsecutiveDays: 1, // Simulamos que hemos usado 1 predicicon de dia consecutivos
      };
    };

    const apiResponse = simulateAPIResponse();
    setLimits({
      dailyLimit: user.type_user === 'Premium' ? 10 : 5,
      consecutiveDaysLimit: 2,
      usedToday: apiResponse.usedToday,
      usedConsecutiveDays: apiResponse.usedConsecutiveDays,
    });
  }, [user, accessToken]);

  const canMakePrediction = () => {
    return limits.usedToday < limits.dailyLimit && limits.usedConsecutiveDays < limits.consecutiveDaysLimit;
  };

  const incrementUsage = () => {
    setLimits(prev => ({
      ...prev,
      usedToday: prev.usedToday + 1,
      usedConsecutiveDays: prev.usedConsecutiveDays + 1,
    }));
  };

  return { limits, canMakePrediction, incrementUsage };
}