import React, { useState, useEffect } from 'react';
import './DrawingView.css';
import PixelGrid from './PixelGrid';
import ColorSelector from './ColorSelector';
import PendingPixels from './PendingPixels';
import FailedPixels from './FailedPixels';
import { DrawingInfos, PixelInfos } from '../customTypes';
import { useDojo } from '../dojo/useDojo';
import { Account } from 'starknet';
import { hexStringToRGB, rgbToHex } from '../utils/colorFunctions';
import { useComponentValue, useQuerySync } from "@dojoengine/react";
import { type Entity } from "@dojoengine/recs";
import { bigIntToHexString } from '../dojo/adrsParser';
import OwnedPixels from './OwnedPixels';


interface DrawingViewProps {
  entities: Entity[];
  drawing: DrawingInfos;
  account: Account | undefined;
}

const DrawingView: React.FC<DrawingViewProps> = ({ entities, account, drawing }) => {
  console.log("DrawingView");
  const { setup: { systemCalls: { colorPixels }, clientComponents: {Drawing, Pixel}, toriiClient } } = useDojo();

  useQuerySync(toriiClient, [Drawing, Pixel] as any, []);
  let ownedPixels: PixelInfos[] = [];
  let grid: PixelInfos[][] = Array(drawing.pixelsColumnCount).fill(null).map(() => Array(drawing.pixelsRowCount).fill(null));
  for (const entityId of entities) {
    const pixel = useComponentValue(Pixel, entityId);
    if (pixel) {
      let owner = bigIntToHexString(pixel.owner);
      if (owner === account?.address) {
        ownedPixels.push({
          owner: owner,
          color: rgbToHex(pixel.r, pixel.g, pixel.b),
          x: pixel.x,
          y: pixel.y,
        });
      }
      grid[pixel.x][pixel.y] = {
        owner: owner,
        color: rgbToHex(pixel.r, pixel.g, pixel.b),
        x: pixel.x,
        y: pixel.y,
      };
    }
  }
  for (let x = 0; x < drawing.pixelsColumnCount; x++) {
    for (let y = 0; y < drawing.pixelsRowCount; y++) {
      if (grid[x][y] === null) {
        grid[x][y] = {
          owner: '',
          color: '',
          x,
          y,
        };
      }
    }
  }


  const [selectedColor, setSelectedColor] = useState<string>('');
  const [pendingPixels, setPendingPixels] = useState<{ x: number; y: number; color: string; isCommitting: boolean; error: boolean }[]>([]);
  const [failedPixels, setFailedPixels] = useState<{ x: number; y: number; color: string }[]>([]); // Track failed pixels
  // const [grid, setGrid] = useState<PixelInfos[][]>(
  //   Array(drawing.pixelsColumnCount)
  //     .fill(null)
  //     .map((_, x) => 
  //       Array(drawing.pixelsRowCount).fill(null).map((_, y) => ({ owner: '', color: '', x, y }))
  //     )
  // );
  

  // useEffect(() => {
  //   const fetchPixels = () => {
  //     console.log("Fetching pixels");
  //     let pixels = ToriiGetter.getDrawingPixels(drawing.id, drawing.pixelsRowCount, drawing.pixelsColumnCount, Pixel);
  //     setGrid(pixels);
  //   };
  //   fetchPixels();
  //   const interval = setInterval(fetchPixels, 5000);
  //   return () => clearInterval(interval);
  // }, []);

  const handlePixelClick = (x: number, y: number) => {
    if (selectedColor && !grid[x][y].owner) {
      const newPendingPixels = [...pendingPixels];
      const isAlreadyPending = newPendingPixels.some((pixel) => pixel.x === x && pixel.y === y);
  
      if (!isAlreadyPending) {
        newPendingPixels.push({ x, y, color: selectedColor, isCommitting: false, error: false });
        setPendingPixels(newPendingPixels);
      }
    }
  };
  

  const handleCommit = async () => {
    if(!account) return;

    const commitPendingPixels = pendingPixels.filter((pixel) => !pixel.isCommitting);
  
    if (commitPendingPixels.length === 0) return;
  
    const updatedPendingPixels = pendingPixels.map((pixel) =>
      commitPendingPixels.includes(pixel) ? { ...pixel, isCommitting: true } : pixel
    );
    setPendingPixels(updatedPendingPixels);
  
    let x: number[] = [];
    let y: number[] = [];
    let r: number[] = [];
    let g: number[] = [];
    let b: number[] = [];
  
    commitPendingPixels.forEach(({ x: xCoord, y: yCoord, color }) => {
      const { r: red, g: green, b: blue } = hexStringToRGB(color);
      x.push(xCoord);
      y.push(yCoord);
      r.push(red);
      g.push(green);
      b.push(blue);
    });
  
    let res = await colorPixels(account, drawing.id, x, y, r, g, b);
  
    if (res) {
      const newGrid = [...grid];
      commitPendingPixels.forEach(({ x, y, color }) => {
        newGrid[x][y] = { ...newGrid[x][y], owner: account.address, color }; // Update owner and color
      });
      // setGrid(newGrid);
      setPendingPixels(pendingPixels.filter((pixel) => !commitPendingPixels.includes(pixel)));
    } else {
      const newFailedPixels = commitPendingPixels.map(({ x, y, color }) => ({ x, y, color }));
      setFailedPixels([...failedPixels, ...newFailedPixels]);
      const updatedWithError = pendingPixels.map((pixel) =>
        commitPendingPixels.includes(pixel) ? { ...pixel, isCommitting: false, error: true } : pixel
      );
      setPendingPixels(updatedWithError);
    }
  };
  
  const handleCancelPixel = (x: number, y: number) => {
    const newPendingPixels = pendingPixels.filter((pixel) => pixel.x !== x || pixel.y !== y);
    setPendingPixels(newPendingPixels);
  
    const newGrid = [...grid];
    newGrid[x][y] = { ...newGrid[x][y], owner: '', color: '' }; // Reset owner and color
    // setGrid(newGrid);
  };
  

  return (
    <div className="DrawingView">
      <div className="controls">
        {pendingPixels.length > 0 && <PendingPixels
          pendingPixels={pendingPixels}
          onCommit={handleCommit}
          onCancelPixel={handleCancelPixel}
        />}
        {failedPixels.length > 0 && <FailedPixels failedPixels={failedPixels} />}
        {ownedPixels.length > 0 && <OwnedPixels pixels={ownedPixels} userAddress={account?.address} />}
      </div>
      <PixelGrid grid={grid} onPixelClick={handlePixelClick} pendingPixels={pendingPixels} />
      <ColorSelector selectedColor={selectedColor} onSelectColor={setSelectedColor} />
    </div>
  );
};

export default DrawingView;
