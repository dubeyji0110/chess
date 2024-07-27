'use client';

import React from 'react';
import classNames from 'classnames';

interface IButtonProps {
  children: React.ReactNode;
  className?: string | undefined;
  onClick?: () => void;
}
const Button = ({ children, className, onClick }: IButtonProps) => {
  return (
    <div
      className={classNames(className, 'px-5 py-3 rounded-md cursor-pointer transition-colors')}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Button;
