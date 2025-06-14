import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '../lib/axios';
import PackCard from '../components/packs/PackCard';
import LoadingWindow from '../components/windows-ui/LoadingWindow';
import Window from '../components/windows-ui/Window';

const OpenPacks = () => {
  const { data: packs, isLoading } = useQuery({
    queryKey: ['packs'],
    queryFn: () => axios.get('/packs').then(res => res.data)
  });

  if (isLoading) {
    return <LoadingWindow />;
  }

  return (
    <div className="flex justify-center pb-5 px-5 w-full box-border">
      <div className="w-[800px] relative mx-auto mb-5 mt-4">
        <Window 
          title="Abrir Sobres"
          className="bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] p-2.5"
        >
          <div className="p-5 bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {packs?.map(pack => (
                <PackCard key={pack.id} pack={pack} />
              ))}
            </div>
          </div>
        </Window>
      </div>
    </div>
  );
};

export default OpenPacks;
  