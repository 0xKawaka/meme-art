import React from 'react';
import './FailedPixels.css';

interface FailedPixelsProps {
  failedPixels: { x: number; y: number; color: string }[];
}

const FailedPixels: React.FC<FailedPixelsProps> = ({ failedPixels }) => {
  return (
    <div className="failed-pixels">
      <div className='failed-pixels-title'>Failed Pixels</div>
      {failedPixels.length === 0 ? (
        <p className="no-failed">No failed pixels.</p>
      ) : (
        <ul className="failed-list">
          {failedPixels.map((pixel, index) => (
            <li key={index} className="failed-item">
              <div className="pixel-info">
                Pixel at ({pixel.x}, {pixel.y})
              </div>
              <div className="pixel-color" style={{ backgroundColor: pixel.color }}></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FailedPixels;
