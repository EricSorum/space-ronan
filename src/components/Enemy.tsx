import React from 'react';

interface EnemyProps {
  x: number;
  y: number;
}

const Enemy: React.FC<EnemyProps> = ({ x, y }) => {
  return (
    <div
      className="absolute w-8 h-8 bg-red-500"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%) rotate(180deg)',
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
      }}
    />
  );
};

export default Enemy;