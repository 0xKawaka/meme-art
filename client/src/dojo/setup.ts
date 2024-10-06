import { DojoConfig, DojoProvider } from "@dojoengine/core";
import * as torii from "@dojoengine/torii-client";
import { createClientComponents } from "./createClientComponents";
import { createSystemCalls } from "./createSystemCalls";
import { defineContractComponents } from "./typescript/models.gen";
import { world } from "./world";
import { setupWorld } from "./typescript/contracts.gen";
import { Account, ArraySignatureType } from "starknet";
import { BurnerManager } from "@dojoengine/create-burner";
import { getSyncEvents, getSyncEntities } from "@dojoengine/state";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup({ ...config }: DojoConfig) {
    const toriiClient = await torii.createClient({
        rpcUrl: config.rpcUrl,
        toriiUrl: config.toriiUrl,
        relayUrl: "",
        worldAddress: config.manifest.world.address || "",
    });

    // create contract components
    const contractComponents = defineContractComponents(world);

    // create client components
    const clientComponents = createClientComponents({ contractComponents });

    // create dojo provider
    const dojoProvider = new DojoProvider(config.manifest, config.rpcUrl);

    // Sync all events
    const eventSync = getSyncEvents(
        toriiClient,
        contractComponents as any,
        undefined,
        []
    );

    // Sync all entities
    const sync = await getSyncEntities(
        toriiClient,
        contractComponents as any,
        []
    );

    // setup world
    const client = await setupWorld(dojoProvider);

    const burnerManager = new BurnerManager({
        masterAccount: new Account(
            {
                nodeUrl: config.rpcUrl,
            },
            config.masterAddress,
            config.masterPrivateKey
        ),
        accountClassHash: config.accountClassHash,
        rpcProvider: dojoProvider.provider,
        feeTokenAddress: config.feeTokenAddress,
    });

    try {
        await burnerManager.init();
        if (burnerManager.list().length === 0) {
            console.log("Creating new account");
            // await burnerManager.create({prefundedAmount: "1000000000000"});
            await burnerManager.create();
        }
    } catch (e) {
        console.error(e);
    }



    return {
        client,
        clientComponents,
        contractComponents,
        systemCalls: createSystemCalls({ client }, clientComponents, world),
        publish: (typedData: string, signature: ArraySignatureType) => {
            toriiClient.publishMessage(typedData, signature);
        },
        config,
        dojoProvider,
        burnerManager,
        toriiClient,
        eventSync,
        sync,
    };
}
