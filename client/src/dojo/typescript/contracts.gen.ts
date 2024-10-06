import { Account } from "starknet";
import { DojoProvider } from "@dojoengine/core";

export type IWorld = Awaited<ReturnType<typeof setupWorld>>;

export async function setupWorld(provider: DojoProvider) {
    // System definitions for `memeart-MemeArt` contract
    function MemeArt() {
        const contract_name = "MemeArt";

        
        // Call the `world` system with the specified Account and calldata
        const world = async (props: { account: Account }) => {
            try {
                return await provider.execute(
                    props.account,
                    {
                        contractName: contract_name,
                        entrypoint: "world",
                        calldata: [],
                    },
                    "memeart"
                );
            } catch (error) {
                console.error("Error executing spawn:", error);
                throw error;
            }
        };
            

    
        // Call the `createDrawing` system with the specified Account and calldata
        // const createDrawing = async (props: { account: Account, name: string, pixelsRowCount: number, totalMarketcap: bigint, quoteCurrency: bigint }) => {
        //     try {
        //         return await provider.execute(
        //             props.account,
        //             {
        //                 contractName: contract_name,
        //                 entrypoint: "createDrawing",
        //                 calldata: [props.name,
        //         props.pixelsRowCount,
        //         props.totalMarketcap,
        //         props.quoteCurrency],
        //             },
        //             "memeart"
        //         );
        //     } catch (error) {
        //         console.error("Error executing spawn:", error);
        //         throw error;
        //     }
        // };

        // Call the `createDrawing` system with the specified Account and calldata
        const createDrawing = async (props: { account: Account, name: bigint, symbol: bigint, rdmSalt: bigint }) => {
            try {
                return await provider.execute(
                    props.account,
                    {
                        contractName: contract_name,
                        entrypoint: "createDrawing",
                        calldata: [props.name,
                        props.symbol,
                        props.rdmSalt],
                    },
                    "memeart"
                );
            } catch (error) {
                console.error("Error executing createDrawing:", error);
                throw error;
            }
        };
            

    
        // Call the `colorPixels` system with the specified Account and calldata
        const colorPixels = async (props: { account: Account, drawingId: number, x: Array<Number>, y: Array<Number>, r: Array<Number>, g: Array<Number>, b: Array<Number> }) => {

            try {
                return await provider.execute(
                    props.account,
                    {
                        contractName: contract_name,
                        entrypoint: "colorPixels",
                        calldata: [props.drawingId,
                props.x.length, ...props.x,
                props.y.length, ...props.y,
                props.r.length, ...props.r,
                props.g.length, ...props.g,
                props.b.length, ...props.b],
                    },
                    "memeart"
                );
            } catch (error) {
                console.error("Error executing colorPixels:", error);
                throw error;
            }
        };
            

        return {
            world, createDrawing, colorPixels
        };
    }

    return {
        MemeArt: MemeArt()
    };
}
