import { liga1, liga2, liga3 } from "@/common/assets";

const DIVISION_THRESHOLDS = [
    { threshold: 0, name: "bronze", image: liga3, nextLevel: "silver", maxPoints: 200 },
    { threshold: 200, name: "silver", image: liga2, nextLevel: "gold", maxPoints: 600 },
    { threshold: 601, name: "gold", image: liga1, nextLevel: null, maxPoints: null },
  ];

export const getDivisionInfo = (points) => {
    for (let i = DIVISION_THRESHOLDS.length - 1; i >= 0; i--) {
      const division = DIVISION_THRESHOLDS[i];
      if (points >= division.threshold) {
        return division;
      }
    }
    return DIVISION_THRESHOLDS[0]; 
  };

export const getAllDivisions = () => DIVISION_THRESHOLDS.map(({ name, image }) => ({ name, image }));