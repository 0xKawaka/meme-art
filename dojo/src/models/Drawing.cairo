use starknet::ContractAddress;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
#[dojo::event]
pub struct Drawing {
    #[key]
    pub id: u32,
    pub owner: ContractAddress,
    pub name: felt252,
    pub drawnPixels: u32,
    pub pixelsRowCount: u16,
    pub pixelsColumnCount: u16,
    pub raiseTarget: u256,
    pub quoteCurrency: ContractAddress,
    pub token: ContractAddress,
    pub pricePerPixel: u256,
    pub tokenPerPixel: u256,
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct DrawingsCount {
    #[key]
    pub id: u32,
    pub count: u32,
}