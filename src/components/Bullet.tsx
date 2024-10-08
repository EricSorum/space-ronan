import React from 'react';

interface BulletProps {
  x: number;
  y: number;
}

const Bullet: React.FC<BulletProps> = ({ x, y }) => {
  return (
    <div
      className="absolute w-2 h-4 bg-yellow-400"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)'
      }}
    />
  );
};

export default Bullet;