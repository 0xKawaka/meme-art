
// Generated by dojo-bindgen on Sat, 5 Oct 2024 22:46:05 +0000. Do not modify this file manually.
// Import the necessary types from the recs SDK
// generate again with `sozo build --typescript` 
import { defineComponent, Type as RecsType, World } from "@dojoengine/recs";

export type ContractComponents = Awaited<ReturnType<typeof defineContractComponents>>;



// Type definition for `dojo::model::layout::Layout` enum
export type Layout = { type: 'Fixed'; value: RecsType.NumberArray; } | { type: 'Struct'; value: RecsType.StringArray; } | { type: 'Tuple'; value: RecsType.StringArray; } | { type: 'Array'; value: RecsType.StringArray; } | { type: 'ByteArray'; } | { type: 'Enum'; value: RecsType.StringArray; };

export const LayoutDefinition = {
    type: RecsType.String,
    value: RecsType.String
};
        
// Type definition for `core::byte_array::ByteArray` struct
export interface ByteArray {
    data: String[];
    pending_word: BigInt;
    pending_word_len: Number;
    
}
export const ByteArrayDefinition = {
    data: RecsType.StringArray,
    pending_word: RecsType.BigInt,
    pending_word_len: RecsType.Number,
    
};

// Type definition for `memeart::models::Drawing::Drawing` struct
export interface Drawing {
    id: Number;
    owner: BigInt;
    name: BigInt;
    drawnPixels: Number;
    pixelsRowCount: Number;
    pixelsColumnCount: Number;
    raiseTarget: U256;
    quoteCurrency: BigInt;
    token: BigInt;
    pricePerPixel: U256;
    tokenPerPixel: U256;
    
}
export const DrawingDefinition = {
    id: RecsType.Number,
    owner: RecsType.BigInt,
    name: RecsType.BigInt,
    drawnPixels: RecsType.Number,
    pixelsRowCount: RecsType.Number,
    pixelsColumnCount: RecsType.Number,
    raiseTarget: U256Definition,
    quoteCurrency: RecsType.BigInt,
    token: RecsType.BigInt,
    pricePerPixel: U256Definition,
    tokenPerPixel: U256Definition,
    
};

// Type definition for `dojo::model::layout::FieldLayout` struct
export interface FieldLayout {
    selector: BigInt;
    layout: Layout;
    
}
export const FieldLayoutDefinition = {
    selector: RecsType.BigInt,
    layout: LayoutDefinition,
    
};

// Type definition for `core::integer::u256` struct
export interface U256 {
    low: BigInt;
    high: BigInt;
    
}
export const U256Definition = {
    low: RecsType.BigInt,
    high: RecsType.BigInt,
    
};


// Type definition for `memeart::models::Drawing::DrawingsCount` struct
export interface DrawingsCount {
    id: Number;
    count: Number;
    
}
export const DrawingsCountDefinition = {
    id: RecsType.Number,
    count: RecsType.Number,
    
};


// Type definition for `memeart::models::Pixel::Pixel` struct
export interface Pixel {
    drawingId: Number;
    x: Number;
    y: Number;
    owner: BigInt;
    r: Number;
    g: Number;
    b: Number;
    
}
export const PixelDefinition = {
    drawingId: RecsType.Number,
    x: RecsType.Number,
    y: RecsType.Number,
    owner: RecsType.BigInt,
    r: RecsType.Number,
    g: RecsType.Number,
    b: RecsType.Number,
    
};


// Type definition for `memeart::models::Settings::Settings` struct
export interface Settings {
    key: Number;
    owner: BigInt;
    pixelsRowCount: Number;
    pixelsColumnCount: Number;
    raiseTarget: U256;
    quoteCurrency: BigInt;
    tokenHash: BigInt;
    tokenTotalSupply: U256;
    
}
export const SettingsDefinition = {
    key: RecsType.Number,
    owner: RecsType.BigInt,
    pixelsRowCount: RecsType.Number,
    pixelsColumnCount: RecsType.Number,
    raiseTarget: U256Definition,
    quoteCurrency: RecsType.BigInt,
    tokenHash: RecsType.BigInt,
    tokenTotalSupply: U256Definition,
    
};


export function defineContractComponents(world: World) {
    return {

        // Model definition for `memeart::models::Drawing::Drawing` model
        Drawing: (() => {
            return defineComponent(
                world,
                {
                    id: RecsType.Number,
                    owner: RecsType.BigInt,
                    name: RecsType.BigInt,
                    drawnPixels: RecsType.Number,
                    pixelsRowCount: RecsType.Number,
                    pixelsColumnCount: RecsType.Number,
                    raiseTarget: U256Definition,
                    quoteCurrency: RecsType.BigInt,
                    token: RecsType.BigInt,
                    pricePerPixel: U256Definition,
                    tokenPerPixel: U256Definition,
                },
                {
                    metadata: {
                        namespace: "memeart",
                        name: "Drawing",
                        types: ["u32", "ContractAddress", "felt252", "u32", "u16", "u16", "ContractAddress", "ContractAddress"],
                        customTypes: ["U256", "U256", "U256"],
                    },
                }
            );
        })(),

        // Model definition for `memeart::models::Drawing::DrawingsCount` model
        DrawingsCount: (() => {
            return defineComponent(
                world,
                {
                    id: RecsType.Number,
                    count: RecsType.Number,
                },
                {
                    metadata: {
                        namespace: "memeart",
                        name: "DrawingsCount",
                        types: ["u32", "u32"],
                        customTypes: [],
                    },
                }
            );
        })(),

        // Model definition for `memeart::models::Pixel::Pixel` model
        Pixel: (() => {
            return defineComponent(
                world,
                {
                    drawingId: RecsType.Number,
                    x: RecsType.Number,
                    y: RecsType.Number,
                    owner: RecsType.BigInt,
                    r: RecsType.Number,
                    g: RecsType.Number,
                    b: RecsType.Number,
                },
                {
                    metadata: {
                        namespace: "memeart",
                        name: "Pixel",
                        types: ["u32", "u16", "u16", "ContractAddress", "u8", "u8", "u8"],
                        customTypes: [],
                    },
                }
            );
        })(),

        // Model definition for `memeart::models::Settings::Settings` model
        Settings: (() => {
            return defineComponent(
                world,
                {
                    key: RecsType.Number,
                    owner: RecsType.BigInt,
                    pixelsRowCount: RecsType.Number,
                    pixelsColumnCount: RecsType.Number,
                    raiseTarget: U256Definition,
                    quoteCurrency: RecsType.BigInt,
                    tokenHash: RecsType.BigInt,
                    tokenTotalSupply: U256Definition,
                },
                {
                    metadata: {
                        namespace: "memeart",
                        name: "Settings",
                        types: ["u8", "ContractAddress", "u16", "u16", "ContractAddress", "ClassHash"],
                        customTypes: ["U256", "U256"],
                    },
                }
            );
        })(),
    };
}
