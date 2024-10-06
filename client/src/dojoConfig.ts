import { createDojoConfig } from "@dojoengine/core";
import manifest from "./dojo/manifest.json";

 let dojoConfig = createDojoConfig({
    manifest,
});

// dojoConfig.rpcUrl = "https://api.cartridge.gg/x/starknet/sepolia";
// dojoConfig.toriiUrl = "https://api.cartridge.gg/x/meme-art/torii";
// dojoConfig.masterAddress = "0x70f190c20ae3ea468887ce82b86f3169a076c12b9e167997d8e5e080c5880b3";
// dojoConfig.masterPrivateKey  = "0x3ae2c43e497f11a7bde8fef74d83199f55161ac62ae953e7e3036e33a4965d5";

// dojoConfig.rpcUrl = "https://api.cartridge.gg/x/blockheroes/katana";
// dojoConfig.toriiUrl = "https://api.cartridge.gg/x/blockheroes/torii";
// dojoConfig.masterAddress = "0x5b21b14f3649a01ccf6b25cf3b87183c0075d31d5f36ad9462cee5483f269c5";
// dojoConfig.masterPrivateKey  = "0x7e967b3a84b52726375b600157215b41bf4e361ab6db270a7b22729e95d4a91";

export {dojoConfig};

