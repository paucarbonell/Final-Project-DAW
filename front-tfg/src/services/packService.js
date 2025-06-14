import api from '../lib/axios';

export const openPack = async (packId) => {
  const response = await api.post(`/packs/${packId}/open`);
  return response.data;
};

export const resetPackCounters = async () => {
  const response = await api.post('/user/reset-pack-counters');
  return response.data;
}; 