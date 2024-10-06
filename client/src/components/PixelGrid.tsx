import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import './PixelGrid.css';
import { PixelInfos } from '../customTypes';

interface PixelGridProps {
  grid: PixelInfos[][];
  pendingPixels: { x: number; y: number; color: string }[];
  onPixelClick: (x: number, y: number) => void;
}

const PixelGrid: React.FC<PixelGridProps> = ({ grid, pendingPixels, onPixelClick }) => {
  const [zoom, setZoom] = useState<number>(1); // Zoom level
  const [dragging, setDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [translate, setTranslate] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const MIN_ZOOM = 0.6;
  // const MAX_ZOOM = 3;

  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault(); // This will now work without warnings
      const zoomChange = event.deltaY > 0 ? -0.1 : 0.1;
      setZoom((prevZoom) => {
        // const newZoom = Math.max(MIN_ZOOM, Math.min(prevZoom + zoomChange, MAX_ZOOM));
        const newZoom = Math.max(MIN_ZOOM, prevZoom + zoomChange);
        return newZoom;
      });
    };

    const gridElement = gridRef.current;

    if (gridElement) {
      // Add the wheel event listener with { passive: false }
      gridElement.addEventListener('wheel', handleWheel, { passive: false });

      // Cleanup event listener on component unmount
      return () => {
        gridElement.removeEventListener('wheel', handleWheel);
      };
    }
  }, []);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    setDragStart({ x: event.clientX - translate.x, y: event.clientY - translate.y });
  };

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (dragging) {
        const newTranslate = {
          x: event.clientX - dragStart.x,
          y: event.clientY - dragStart.y,
        };
        setTranslate(newTranslate);
      }
    },
    [dragging, dragStart]
  );

  const handleMouseUp = () => {
    setDragging(false);
  };

  const isPending = (x: number, y: number) => {
    return pendingPixels.some((pixel) => pixel.x === x && pixel.y === y);
  };

  const getPendingColor = (x: number, y: number) => {
    const pendingPixel = pendingPixels.find((pixel) => pixel.x === x && pixel.y === y);
    return pendingPixel ? pendingPixel.color : '';
  };

  // Dynamic calculation of pixel size based on grid dimensions
  const containerSize = 600; // Assuming a 600px square container for the grid
  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  const basePixelSize = useMemo(() => {
    const maxGridSize = Math.max(rows, cols);
    return Math.floor(containerSize / maxGridSize); // Base pixel size
  }, [rows, cols]);

  // Calculate the pixel size with zoom applied
  const pixelSize = useMemo(() => {
    return basePixelSize * zoom; // Scale pixel size according to the zoom level
  }, [basePixelSize, zoom]);

  return (
    <div
      ref={gridRef}
      className="pixel-grid-container"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        display: 'inline-block',
        overflow: 'hidden',
        padding: '10px',
        cursor: dragging ? 'grabbing' : 'grab',
        transform: `translate(${translate.x}px, ${translate.y}px)`, // Translate grid based on drag
        transition: dragging ? 'none' : 'transform 0.1s ease-out',
        willChange: 'transform',
      }}
    >
      <div className="pixel-grid">
        {grid.map((row, x) => (
          <div className="row" key={x}>
            {row.map((pixelInfo, y) => {
              const displayColor = isPending(x, y) ? getPendingColor(x, y) : pixelInfo.color;
              return (
                <div
                  key={y}
                  className="pixel"
                  onClick={() => onPixelClick(x, y)}
                  style={{
                    backgroundColor: displayColor || 'white',
                    width: `${pixelSize}px`,
                    height: `${pixelSize}px`,
                    border: '1px solid black',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PixelGrid;
