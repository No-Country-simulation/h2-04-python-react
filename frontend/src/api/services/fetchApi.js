const API_KEY = import.meta.env.VITE_API_KEY;
const API_HOST = 'v3.football.api-sports.io';

export async function fetchFromAPI(endpoint) {
  const url = new URL(`https://${API_HOST}/${endpoint}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'x-rapidapi-host': API_HOST,
        'x-rapidapi-key': API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}