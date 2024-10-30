/* eslint-disable react-hooks/rules-of-hooks */
import { useDivisionThresholds } from '@/api/services/useDivision';
import { liga1, liga2, liga3, locked } from "@/common/assets";

// Mapeo de imágenes según el nombre de la división
const divisionImages = {
  bronze: liga3,
  silver: liga2,
  gold: liga1,
};

export const getDivisionInfo = (points) => {
  const { data: divisions, isLoading, error } = useDivisionThresholds();

  // Manejar estados de carga y error
  if (isLoading) {
    return { threshold: 0, name: "loading", image: null, nextLevel: null, maxPoints: 0 };
  }

  if (error || !divisions) {
    return { threshold: 0, name: "error", image: null, nextLevel: null, maxPoints: 0 };
  }

  // Si no tiene puntos, retornar un objeto especial indicando que no está en ninguna división
  if (points === 0) {
    return { 
      threshold: 0, 
      name: "none", 
      image: locked, 
      nextLevel: "bronze", 
      maxPoints: divisions[0].threshold 
    };
  }

  // Ordenar las divisiones por threshold de mayor a menor
  const sortedDivisions = [...divisions].sort((a, b) => b.threshold - a.threshold);

  // Encontrar la división correspondiente
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

  // Si no se encuentra ninguna división, retornar la primera (bronze)
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