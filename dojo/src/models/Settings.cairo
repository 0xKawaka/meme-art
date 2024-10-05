use starknet::ContractAddress;
use starknet::class_hash::ClassHash;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct Settings {
    #[key]
    pub key: u8,
    pub owner: ContractAddress,
    pub pixelsRowCount: u16,
    pub pixelsColumnCount: u16,
    pub raiseTarget: u256,
    pub quoteCurrency: ContractAddress,
    pub tokenHash: ClassHash,
    pub tokenTotalSupply: u256,
}