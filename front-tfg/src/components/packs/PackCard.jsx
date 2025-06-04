import React from 'react';

const PackCard = ({ pack, onOpen }) => {
  const { name, description, price, cards_per_pack } = pack;

  return (
    <div className="bg-white border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] p-2.5 transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#808080] hover:border-t-[#ffffff] hover:border-l-[#ffffff]">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base font-bold text-black">{name}</h3>
        <span className="text-sm text-black">{price}€</span>
      </div>
      <div className="mb-4 text-black">
        <p className="text-sm mb-2">{description}</p>
        <div className="text-xs text-black">
          <span>Cartas por sobre: {cards_per_pack}</span>
        </div>
      </div>
      <button 
        className="w-full text-sm px-4 py-2 bg-[#c0c0c0] border-2 border-[#ffffff] border-t-[#808080] border-l-[#808080] text-[#000000] cursor-pointer font-['MS Sans Serif','Segoe UI','Tahoma','Geneva','Verdana',sans-serif] hover:border-[#808080] hover:border-t-[#ffffff] hover:border-l-[#ffffff] active:border-[#808080] active:border-t-[#ffffff] active:border-l-[#ffffff] active:pt-[9px] active:pr-[15px] active:pb-[7px] active:pl-[17px]"
        onClick={() => onOpen(pack)}
      >
        Abrir Sobre
      </button>
    </div>
  );
};

export default PackCard; 