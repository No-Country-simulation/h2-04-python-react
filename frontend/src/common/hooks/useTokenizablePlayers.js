import { useQuery } from '@tanstack/react-query';
import { t } from 'i18next';
import { fetchData } from '@/api/services/fetchData';
import useAuthStore from '@/api/store/authStore';

export const useTokenizablePlayers = () => {
  const { accessToken } = useAuthStore();

  return useQuery({
    queryKey: ['tokenizablePlayers'],
    queryFn: async () => {
      try {
        const data = await fetchData('players/?tokenizable=true', 'GET', null, accessToken);
        
        return data.results;
      } catch (error) {
        console.error('Error fetching tokenizable players:', error);
        throw new Error(t('infoMsg.fetchPlayersError'));
      }
    },
    refetchOnMount: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};