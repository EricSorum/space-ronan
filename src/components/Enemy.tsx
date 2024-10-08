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
        transform: 'translate(-50%, -50%)',
        clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 50% 90%, 0% 50%)'
      }}
    />
  );
};

export default Enemy;