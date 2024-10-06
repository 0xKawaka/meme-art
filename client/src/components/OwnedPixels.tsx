import React from 'react';
import './OwnedPixels.css';
import { PixelInfos } from '../customTypes';

interface OwnedPixelsProps {
  pixels: PixelInfos[];
  userAddress: string | undefined;
}

const OwnedPixels: React.FC<OwnedPixelsProps> = ({ pixels, userAddress }) => {
  // Filter pixels owned by the user
  let ownedPixels: PixelInfos[] = [];
  if(userAddress){
    ownedPixels = pixels.filter(pixel => pixel.owner.toLowerCase() === userAddress.toLowerCase());
  }

  return (
    <div className="owned-pixels">
      <div className='owned-pixels-title'>Owned Pixels</div>
      <p>Total: {ownedPixels.length}</p>
      {ownedPixels.length === 0 ? (
        <p className="no-owned">You don't own any pixels.</p>
      ) : (
        <ul className="owned-list">
          {ownedPixels.map((pixel, index) => (
            <li key={index} className="owned-item">
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

export default OwnedPixels;
