/* eslint-disable react-hooks/rules-of-hooks */
import { useDivisionThresholds } from '@/api/services/useDivision';
import { liga1, liga2, liga3, locked } from "@/common/assets";

const divisionImages = {
  bronze: liga3,
  silver: liga2,
  gold: liga1,
};

export const getDivisionInfo = (points) => {
  const { data: divisions, isLoading, error } = useDivisionThresholds();

  if (isLoading) {
    return { threshold: 0, name: "", image: null, nextLevel: null, maxPoints: 0 };
  }

  if (error || !divisions) {
    return { threshold: 0, name: "", image: null, nextLevel: null, maxPoints: 0 };
  }

  if (points === 0) {
    return { 
      threshold: 0, 
      name: "none", 
      image: locked, 
      nextLevel: "bronze", 
      maxPoints: divisions[0].threshold 
    };
  }

  const sortedDivisions = [...divisions].sort((a, b) => b.threshold - a.threshold);

  for (let i = 0; i < sortedDivisions.length; i++) {
    const division = sortedDivisions[i];
    if (points >= division.threshold) {
      return {
        ...division,
        image: divisionImages[division.name],
        nextLevel: i > 0 ? sortedDivisions[i - 1].name : null,
      };
    }
  }

  const lowestDivision = sortedDivisions[sortedDivisions.length - 1];
  return {
    ...lowestDivision,
    image: divisionImages[lowestDivision.name],
    nextLevel: sortedDivisions[sortedDivisions.length - 2]?.name || null,
  };
};

export const getAllDivisions = () => {
  const { data: divisions, isLoading, error } = useDivisionThresholds();

  if (isLoading || error || !divisions) {
    return [];
  }

  return divisions.map(({ name }) => ({
    name,
    image: divisionImages[name],
  }));
};