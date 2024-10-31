import { useQuery } from '@tanstack/react-query';
import { t } from 'i18next';
import { fetchData } from '@/api/services/fetchData';
import useAuthStore from '@/api/store/authStore';

export const usePlayers = () => {
  const { accessToken } = useAuthStore();

  return useQuery({
    queryKey: ['Players'],
    queryFn: async () => {
      try {
        const data = await fetchData('api/tokens/statistics/', 'GET', null, accessToken);
        
        return data.data;
      } catch (error) {
        console.error('Error fetching players:', error);
        throw new Error(t('infoMsg.fetchPlayersError'));
      }
    },
    refetchOnMount: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useTokenizablePlayers = () => {
  const { accessToken } = useAuthStore();

  return useQuery({
    queryKey: ['Tokenizable-Players'],
    queryFn: async () => {
      try {
        const data = await fetchData('players/?tokenizable=true', 'GET', null, accessToken);
        
        return data.results;
      } catch (error) {
        console.error('Error fetching players:', error);
        throw new Error(t('infoMsg.fetchPlayersError'));
      }
    },
    refetchOnMount: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};