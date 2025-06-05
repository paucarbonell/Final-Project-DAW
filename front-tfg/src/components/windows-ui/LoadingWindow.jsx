import React from 'react';
import Window from './Window';

const LoadingWindow = () => {
  return (
    <div className="flex justify-center items-start p-0 pb-5 px-5 w-full box-border">
      <div className="w-[800px] flex flex-col gap-5 relative mx-auto mb-5">
        <Window title="Cargando..." className="mt-5">
          <div className="text-center p-5 text-sm text-[#000080] bg-[#c0c0c0]">
            Cargando contenido...
          </div>
        </Window>
      </div>
    </div>
  );
};

export default LoadingWindow; 