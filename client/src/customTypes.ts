import { U256 } from "./dojo/typescript/models.gen";
type DrawingInfos = {id: number, creator: string, name: string, drawnPixels: number, pixelsRowCount: number, pixelsColumnCount: number, raiseTarget: U256, quoteCurrency: string, token: string, pricePerPixel: U256, tokenPerPixel: U256};
type PixelInfos = {owner: string, color: string, x: number, y: number};
// type SettingsInfos = {owner, pixelsRowCount: number, pixelsColumnCount: number, raiseTarget: U256, quoteCurrency: string, tokenTotalSupply: U256};
type SettingsInfos = {key: number, owner: BigInt, pixelsRowCount: number, pixelsColumnCount: number, raiseTarget: U256, quoteCurrency: BigInt, tokenHash: BigInt, tokenTotalSupply: U256};

export type { DrawingInfos, PixelInfos, SettingsInfos };
