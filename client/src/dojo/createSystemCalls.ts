import { Account, TransactionFinalityStatus, shortString } from "starknet";
import {
    World,
} from "@dojoengine/recs";
import { ClientComponents } from "./createClientComponents";
import type { IWorld } from "./typescript/contracts.gen";
// import stringToFelt252 from "../Pages/utils/stringToFelt252";
// import EventHandler from "../Blockchain/event/EventHandler";
// import GameEventHandler from "../Blockchain/event/GameEventHandler";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { client }: { client: IWorld },
    // { Position, Moves }: ClientComponents,
    { }: ClientComponents,
    world: World
) {
    // const createDrawing = async (account: Account, name: string, pixelsRowCount: number, totalMarketcap: number, quoteCurrency: string): Promise<number> =>  {
    //     try {
    //         let txRes = await client.MemeArt.createDrawing({
    //             account,
    //             name: name,
    //             pixelsRowCount,
    //             totalMarketcap: BigInt(totalMarketcap),
    //             quoteCurrency: BigInt(quoteCurrency),
    //         });
    //         let res: any = await account.waitForTransaction(txRes.transaction_hash, {
    //             retryInterval: 100,
    //             successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
    //         });
    //         console.log("Drawing ID", Number(res.events[0].data[2]));
    //         return Number(res.events[0].data[2]);
    //     } catch (e: any) {
    //         console.log(e);
    //         return -1;
    //     } 
    //     // finally {
    //     //     Position.removeOverride(positionId);
    //     //     Moves.removeOverride(movesId);
    //     // }
    // };

    const createDrawing = async (account: Account, name: string, symbol: string, rdmSalt: bigint): Promise<number> =>  {
        try {
            let txRes = await client.MemeArt.createDrawing({
                account,
                name: BigInt(shortString.encodeShortString(name)),
                symbol: BigInt(shortString.encodeShortString(symbol)),
                rdmSalt: rdmSalt,
            });
            let res: any = await account.waitForTransaction(txRes.transaction_hash, {
                retryInterval: 100,
                successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
            });
            console.log("Drawing ID", Number(res.events[1].data[3]));
            return Number(res.events[1].data[3]);
        } catch (e: any) {
            console.log(e);
            return -1;
        } 
        // finally {
        //     Position.removeOverride(positionId);
        //     Moves.removeOverride(movesId);
        // }
    };

    const colorPixels = async (account: Account, drawingId: number, x: number[], y: number[], r: number[], g: number[], b: number[]): Promise<boolean> => {
        try {
            let txRes = await client.MemeArt.colorPixels({
                account,
                drawingId,
                x,
                y,
                r,
                g,
                b,
            });
            let res = await account.waitForTransaction(txRes.transaction_hash, {
                retryInterval: 100,
                successStates: [TransactionFinalityStatus.ACCEPTED_ON_L2],
            });
            return true;
        }
        catch (e: any) {
            console.log(e);
            return false;
        }
    }


    return {
        createDrawing,
        colorPixels,
    };
}
