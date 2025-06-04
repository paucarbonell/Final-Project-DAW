import React from 'react';
// import './Button.css'; // Se eliminará al refactorizar

const Button = ({ 
  children, 
  onClick, 
  disabled = false,
  className = '',
  type = 'button',
  outlined = false
}) => {

  const baseStyles = 'bg-[#c0c0c0] border-2 border-solid px-2 py-1 text-xs cursor-pointer min-w-[75px] relative outline-none';
  const borderStyles = outlined 
    ? 'border-[#808080] border-t-[#ffffff] border-l-[#ffffff]'
    : 'border-[#ffffff] border-t-[#808080] border-l-[#808080]';
    
  const activeStyles = 'active:border-[#808080] active:border-t-[#ffffff] active:border-l-[#ffffff] active:pt-[5px] active:pr-[7px] active:pb-[3px] active:pl-[9px]';
  const focusStyles = 'focus:outline focus:outline-1 focus:outline-[#000000] focus:outline-offset-[-4px]';
  const disabledStyles = 'disabled:text-[#808080] disabled:cursor-not-allowed disabled:border-[#808080] disabled:border-t-[#ffffff] disabled:border-l-[#ffffff] disabled:active:pt-1 disabled:active:px-2'; // Revert padding on active for disabled

  return (
    <button
      type={type}
      className={`
        ${baseStyles} 
        ${borderStyles} 
        ${activeStyles} 
        ${focusStyles} 
        ${disabledStyles}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button; 