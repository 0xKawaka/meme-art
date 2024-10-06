import React, { useState, useEffect } from 'react';
import DrawingsList from '../components/DrawingsList';
import './MemesDrawings.css';
import CreateDrawing from '../components/CreateDrawing';
import { Account } from 'starknet'
import ToriiGetter from '../dojo/ToriiGetter';
import { useDojo } from '../dojo/useDojo';
import { DrawingInfos, SettingsInfos } from '../customTypes';
import DrawingViewWrapper from '../components/DrawingViewWrapper';



type MemesDrawingsProps = {
  account: Account | undefined;
};



const MemesDrawings: React.FC<MemesDrawingsProps> = ({ account }) => {
  const {setup: {clientComponents: {Drawing, Settings}} } = useDojo();

  const [drawings, setDrawings] = useState<DrawingInfos[]>([]);
  const [drawingSelected, setDrawingSelected] = useState<DrawingInfos>();
  const [settings, setSettings] = useState<SettingsInfos>();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateDrawing = (newDrawing: { id: number, name: string; pixelsRowCount: number; creator: string }) => {
    setDrawings([...drawings, { ...newDrawing, drawnPixels: 0, pixelsColumnCount: newDrawing.pixelsRowCount, raiseTarget: {low: BigInt(0), high: BigInt(0)}, quoteCurrency: "", token: "", pricePerPixel: {low: BigInt(0), high: BigInt(0)}, tokenPerPixel: {low: BigInt(0), high: BigInt(0)} }]);
    setShowCreateForm(false);
  };

  const handleSelectedDrawingId = (id: number) => {
    setDrawingSelected(drawings.find(drawing => drawing.id === id));
  }
  

  useEffect(() => {
    const fetchDrawings = () => {
      console.log("Fetching drawings");
      let drawings = ToriiGetter.getAllDrawings(Drawing);
      let settings = ToriiGetter.getSettings(Settings);
      if(settings){
        setSettings(settings);
      }
      else {
        console.log("Settings not found");
      }
      setDrawings(drawings);
    };
    fetchDrawings();
    // const interval = setInterval(fetchDrawings, 1000);
    // return () => clearInterval(interval);
  }, []);


  // const entitiesSet = useEntityQuery([Has(Drawing)]);
  // const entitiesArray = Array.from(entitiesSet);
  // let drawings: Array<DrawingInfos> = [];
  // for(let i = 0; i < entitiesArray.length; i++){
  //   const drawing = useComponentValue(Drawing, entitiesArray[i]);

  //   if(drawing){
  //     drawings.push({id: drawing.id, name: hexToString(drawing.name), pixelsRowCount: drawing.pixelsRowCount, pixelsColumnCount: drawing.pixelsColumnCount, coloredPixels: drawing.drawnPixels, creator: bigIntToHexString(drawing.owner)});
  //   }
  // }


  return (
    <div className="MemesDrawings">
      {showCreateForm &&
        <CreateDrawing handleCreateDrawing={handleCreateDrawing} account={account} settings={settings} />
      }
      {!showCreateForm && !drawingSelected &&
        <>
          <button className="create-drawing-btn" onClick={() => setShowCreateForm(true)}>
            Create Drawing
          </button>
          <DrawingsList drawings={drawings} handleSelectedDrawingId={handleSelectedDrawingId} />
        </>
      }
      {!showCreateForm && drawingSelected &&
        <DrawingViewWrapper account={account} drawing={drawingSelected}/>
      }

    </div>
  );
};

export default MemesDrawings;
