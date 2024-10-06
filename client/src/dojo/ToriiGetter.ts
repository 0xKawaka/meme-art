import { getEntityIdFromKeys } from "@dojoengine/utils";
import { getComponentValue, type Entity, runQuery, Has, HasValue } from "@dojoengine/recs";
import { useDojo } from "./useDojo";
import { DrawingInfos, PixelInfos, SettingsInfos } from "../customTypes";
import { bigIntToHexString, hexToString } from "./adrsParser";
import { rgbToHex } from "../utils/colorFunctions";
import { shortString } from "starknet";


export default class ToriiGetter {

  static getSettings(Settings: any): SettingsInfos | undefined {
    // const { setup: { clientComponents: { Settings } } } = useDojo();
    const entity = getEntityIdFromKeys([BigInt(0)]);
    
    
    const settings = getComponentValue(Settings, entity);
    if(settings){
      return settings as SettingsInfos;
    }
  }

  static getAllDrawings(Drawing: any): Array<DrawingInfos> {
    // const {setup: {clientComponents: {Drawing}}} = useDojo();
    const entitiesSet = runQuery([Has(Drawing)]);
    const entitiesArray = Array.from(entitiesSet);
    let drawings: Array<DrawingInfos> = [];
    for(let i = 0; i < entitiesArray.length; i++){
      const drawing = getComponentValue(Drawing, entitiesArray[i]);

      if(drawing){
        drawings.push({
          id: drawing.id,
          name: shortString.decodeShortString(drawing.name),
          pixelsRowCount: drawing.pixelsRowCount,
          pixelsColumnCount: drawing.pixelsColumnCount,
          drawnPixels: drawing.drawnPixels,
          creator: bigIntToHexString(drawing.owner),
          raiseTarget: {low: drawing.raiseTarget.low, high: drawing.raiseTarget.high},
          quoteCurrency: bigIntToHexString(drawing.quoteCurrency),
          token: bigIntToHexString(drawing.token),
          pricePerPixel: {low: drawing.pricePerPixel.low, high: drawing.pricePerPixel.high},
          tokenPerPixel: {low: drawing.tokenPerPixel.low, high: drawing.tokenPerPixel.high}
        });
      }
    }
    return drawings;
  }

  static getDrawingPixels(drawingId: number,
    pixelsRowCount: number,
    pixelsColumnCount: number, Pixel: any): PixelInfos[][] {
    // const { setup: { clientComponents: { Pixel } } } = useDojo();
    let grid: PixelInfos[][] = Array(pixelsColumnCount).fill(null).map(() => Array(pixelsRowCount).fill(null));

    const entities = runQuery([
      HasValue(Pixel, { drawingId: drawingId }),
    ]);

    for (const entityId of entities) {
      const pixel = getComponentValue(Pixel, entityId);

      if (pixel) {
        grid[pixel.x][pixel.y] = {
          owner: bigIntToHexString(pixel.owner),
          color: rgbToHex(pixel.r, pixel.g, pixel.b),
          x: pixel.x,
          y: pixel.y,
        };
      }
    }
  
    for (let x = 0; x < pixelsColumnCount; x++) {
      for (let y = 0; y < pixelsRowCount; y++) {
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
    return grid;
  }
}