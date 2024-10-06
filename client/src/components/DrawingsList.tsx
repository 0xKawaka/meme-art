import React from 'react';
import './DrawingsList.css';
import { DrawingInfos } from '../customTypes';


interface DrawingsListProps {
  drawings: DrawingInfos[];
  handleSelectedDrawingId: (id: number) => void
}

const DrawingsList: React.FC<DrawingsListProps> = ({ drawings, handleSelectedDrawingId }) => {
  return (
    <div className="drawings-list">
      <div className='drawings-list-title'>Ongoing Drawings</div>
      {drawings.length === 0 ? (
        <p className="no-drawings">No ongoing drawings.</p>
      ) : (
        <ul>
          {drawings.map((drawing, index) => (
            <li key={index} className="drawing-item" onClick={() => handleSelectedDrawingId(drawing.id)}>
              <div className="drawing-header">
                <div>{drawing.name}</div>
                <span className="creator">by {drawing.creator}</span>
              </div>
              <div className="drawing-progress">
                <progress
                  className="progress-bar"
                  value={drawing.drawnPixels}
                  max={drawing.pixelsRowCount * drawing.pixelsColumnCount}
                />
                <span className="progress-info">
                  {drawing.drawnPixels}/{drawing.pixelsRowCount * drawing.pixelsColumnCount} pixels colored
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DrawingsList;
