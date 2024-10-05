use starknet::ContractAddress;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct Pixel {
    #[key]
    pub drawingId: u32,
    #[key]
    pub x: u16,
    #[key]
    pub y: u16,
    pub owner: ContractAddress,
    pub r: u8,
    pub g: u8,
    pub b: u8,
}