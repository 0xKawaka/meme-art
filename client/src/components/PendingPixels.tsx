import React from 'react';
import './PendingPixels.css';
import Loading from './Loading';

interface PendingPixelsProps {
  pendingPixels: { x: number; y: number; color: string; isCommitting: boolean; error: boolean }[];
  onCommit: () => void;
  onCancelPixel: (x: number, y: number) => void;
}

const PendingPixels: React.FC<PendingPixelsProps> = ({ pendingPixels, onCommit, onCancelPixel }) => {
  return (
    <div className="pending-pixels">
      <div className='pending-pixels-title'>Pending Pixels</div>
      {pendingPixels.length === 0 ? (
        <p className="no-pending">No pending pixels.</p>
      ) : (
        <>
          <ul className="pending-list">
            {pendingPixels.map((pixel, index) => (
              <li key={index} className="pending-item">
                <span className="pixel-info">
                  Pixel at ({pixel.x}, {pixel.y})
                </span>
                <span
                  className="pixel-color"
                  style={{ backgroundColor: pixel.color }}
                  title={pixel.color}
                ></span>
                {!pixel.isCommitting ? <button
                  className="cancel-button"
                  onClick={() => onCancelPixel(pixel.x, pixel.y)}
                  title="Cancel this pixel"
                >
                  ✖
                </button>
                : <Loading spinnerSize={18} showText={false} screenCenter={false}/>
                }
              </li>
            ))}
          </ul>
          <button className="commit-button" onClick={onCommit}>
            Commit Pixels
          </button>
        </>
      )}
    </div>
  );
};

export default PendingPixels;
