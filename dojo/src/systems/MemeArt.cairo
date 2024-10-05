use starknet::ContractAddress;
use starknet::class_hash::ClassHash;

#[dojo::interface]
trait IMemeArt {
    fn createDrawing(ref world: IWorldDispatcher, name: felt252, symbol: felt252, rdmSalt: felt252);
    fn colorPixels(ref world: IWorldDispatcher, drawingId: u32, x: Array<u16>, y: Array<u16>, r: Array<u8>, g: Array<u8>, b: Array<u8>);
    fn setOwner(ref world: IWorldDispatcher, owner: ContractAddress);
    fn setPixelsRowCount(ref world: IWorldDispatcher, pixelsRowCount: u16);
    fn setPixelsColumnCount(ref world: IWorldDispatcher, pixelsColumnCount: u16);
    fn setRaiseTarget(ref world: IWorldDispatcher, raiseTarget: u256);
    fn setQuoteCurrency(ref world: IWorldDispatcher, quoteCurrency: ContractAddress);
    fn setTokenHash(ref world: IWorldDispatcher, tokenHash: ClassHash);
    fn setTokenTotalSupply(ref world: IWorldDispatcher, tokenTotalSupply: u256);
    fn dojo_init(ref world: IWorldDispatcher);
}
#[starknet::interface]
pub trait ITokenDeployer<TContractState> {
    fn deployToken(self: @TContractState, name: felt252, symbol: felt252, totalSupply: u256) -> ContractAddress;
}

#[starknet::interface]
pub trait IERC20<TContractState> {
    fn transfer(ref self: TContractState, recipient: ContractAddress, amount: u256) -> bool;
    fn transferFrom(ref self: TContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256) -> bool;
}

#[dojo::contract]
mod MemeArt {
    use super::{IMemeArt, ITokenDeployer, ITokenDeployerDispatcher, ITokenDeployerDispatcherTrait, IERC20, IERC20Dispatcher, IERC20DispatcherTrait};
    use starknet::{ContractAddress, get_caller_address, get_contract_address};
    use memeart::models::{Drawing::{Drawing, DrawingsCount}, Pixel::Pixel, Settings::Settings};
    use starknet::syscalls::deploy_syscall;
    use starknet::SyscallResult;
    use starknet::class_hash::ClassHash;

    #[abi(embed_v0)]
    impl MemeArtImpl of IMemeArt<ContractState> {
        fn createDrawing(ref world: IWorldDispatcher, name: felt252, symbol: felt252, rdmSalt: felt252) {
            let owner = get_caller_address();
            let drawingsCount = get!(world, 0, (DrawingsCount)).count;
            let settings = get!(world, 0, (Settings));

            let mut tokenCalldata = ArrayTrait::new();
            tokenCalldata.append(name);
            tokenCalldata.append(symbol);
            let result: SyscallResult = deploy_syscall(settings.tokenHash, rdmSalt, tokenCalldata.span(), false);
            let (tokenAdrs, _) = result.unwrap();

            // let tokenAdrs = 0x123.try_into().unwrap();
            let pricePerPixel: u256 = settings.raiseTarget / (settings.pixelsRowCount.into() * settings.pixelsColumnCount.into());
            let tokenPerPixel: u256 = settings.tokenTotalSupply / (settings.pixelsRowCount.into() * settings.pixelsColumnCount.into()) / 2;

            // assert currency
            set!(
                world,
                (
                    Drawing {
                        id: drawingsCount, owner, name, drawnPixels: 0, pixelsRowCount:settings.pixelsRowCount, pixelsColumnCount: settings.pixelsColumnCount, raiseTarget:settings.raiseTarget, quoteCurrency: settings.quoteCurrency, token: tokenAdrs, pricePerPixel, tokenPerPixel
                    },
                    DrawingsCount { id: 0, count: drawingsCount + 1 }
                )
            );
            emit!(world, (Drawing { id: drawingsCount, owner, name, drawnPixels: 0,  pixelsRowCount:settings.pixelsRowCount, pixelsColumnCount: settings.pixelsColumnCount, raiseTarget:settings.raiseTarget, quoteCurrency: settings.quoteCurrency, token: tokenAdrs, pricePerPixel, tokenPerPixel }));
        }
        // fn createDrawing(ref world: IWorldDispatcher, name: felt252, pixelsRowCount: u16, raiseTarget: u256, quoteCurrency: ContractAddress) {
        //     let owner = get_caller_address();
        //     let drawingsCount = get!(world, 0, (DrawingsCount)).count;

        //     // let contract_address = world.deploy_contract('salt', actions::TEST_CLASS_HASH.try_into().unwrap());

        //     // assert currency
        //     set!(
        //         world,
        //         (
        //             Drawing {
        //                 id: drawingsCount, owner, name, drawnPixels: 0, pixelsRowCount, pixelsColumnCount: pixelsRowCount, raiseTarget, quoteCurrency
        //             },
        //             DrawingsCount { id: 0, count: drawingsCount + 1 }
        //         )
        //     );
        //     emit!(world, (Drawing { id: drawingsCount, owner, name, drawnPixels: 0, pixelsRowCount, pixelsColumnCount: pixelsRowCount, raiseTarget, quoteCurrency }));
        // }
        fn colorPixels(ref world: IWorldDispatcher, drawingId: u32, x: Array<u16>, y: Array<u16>, r: Array<u8>, g: Array<u8>, b: Array<u8>) {
            assert(x.len() == y.len() && x.len() == r.len() && x.len() == g.len() && x.len() == b.len(), 'Arrays must be same length');
            let drawing = get!(world, drawingId, (Drawing));
            assert(drawing.drawnPixels < drawing.pixelsRowCount.into() * drawing.pixelsColumnCount.into(), 'Drawing completed');
            let settings = get!(world, 0, (Settings));

            let token = IERC20Dispatcher { contract_address: drawing.token };
            let quoteToken = IERC20Dispatcher { contract_address: settings.quoteCurrency };

            let mut i: u32 = 0;
            loop {
                if i == x.len() {
                    break;
                }
                let pixel = get!(world, (drawingId, *x[i], *y[i]), (Pixel));
                assert(pixel.owner.into() == 0x0, 'Pixel already drawn');
                assert(*x[i] < drawing.pixelsColumnCount && *y[i] < drawing.pixelsRowCount, 'Pixel out of bounds');

                set!(
                    world,
                    (
                        Pixel {
                            drawingId, x: *x[i], y: *y[i], owner: get_caller_address(), r: *r[i], g: *g[i], b: *b[i]
                        },
                    )
                );
                i += 1;
            };
            quoteToken.transferFrom(get_caller_address(), get_contract_address(), drawing.pricePerPixel * x.len().into());
            token.transfer(get_caller_address(), drawing.tokenPerPixel * x.len().into());

            set!(
                world,
                (
                    Drawing {
                        id: drawingId, owner: drawing.owner, name: drawing.name, drawnPixels: drawing.drawnPixels + x.len(), pixelsRowCount: drawing.pixelsRowCount, pixelsColumnCount: drawing.pixelsColumnCount, raiseTarget: drawing.raiseTarget, quoteCurrency: drawing.quoteCurrency, token: drawing.token, pricePerPixel: drawing.pricePerPixel, tokenPerPixel: drawing.tokenPerPixel
                    }
                )
            );
        }
        fn setOwner(ref world: IWorldDispatcher, owner: ContractAddress) {
            let settings = get!(world, 0, (Settings));
            assert(settings.owner == get_caller_address(), 'Only owner');
            set!(world, (Settings { owner, ..settings }));
        }
        fn setPixelsRowCount(ref world: IWorldDispatcher, pixelsRowCount: u16) {
            let settings = get!(world, 0, (Settings));
            assert(settings.owner == get_caller_address(), 'Only owner');
            set!(world, (Settings { pixelsRowCount, ..settings }));
        }
        fn setPixelsColumnCount(ref world: IWorldDispatcher, pixelsColumnCount: u16) {
            let settings = get!(world, 0, (Settings));
            assert(settings.owner == get_caller_address(), 'Only owner');
            set!(world, (Settings { pixelsColumnCount, ..settings }));
        }
        fn setRaiseTarget(ref world: IWorldDispatcher, raiseTarget: u256) {
            let settings = get!(world, 0, (Settings));
            assert(settings.owner == get_caller_address(), 'Only owner');
            set!(world, (Settings { raiseTarget, ..settings }));
        }
        fn setQuoteCurrency(ref world: IWorldDispatcher, quoteCurrency: ContractAddress) {
            let settings = get!(world, 0, (Settings));
            assert(settings.owner == get_caller_address(), 'Only owner');
            set!(world, (Settings { quoteCurrency, ..settings }));
        }
        fn setTokenHash(ref world: IWorldDispatcher, tokenHash: ClassHash) {
            let settings = get!(world, 0, (Settings));
            assert(settings.owner == get_caller_address(), 'Only owner');
            set!(world, (Settings { tokenHash, ..settings }));
        }
        fn setTokenTotalSupply(ref world: IWorldDispatcher, tokenTotalSupply: u256) {
            let settings = get!(world, 0, (Settings));
            assert(settings.owner == get_caller_address(), 'Only owner');
            set!(world, (Settings { tokenTotalSupply, ..settings }));
        }
        fn dojo_init(
            ref world: IWorldDispatcher,
        ) {
            // set!(world, (Settings { key: 0, owner: get_caller_address(), pixelsRowCount: 30, pixelsColumnCount: 30, raiseTarget: u256 { low: 5070602400912917605, high: 0 }, quoteCurrency: 0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d.try_into().unwrap(), tokenHash: 0x0171da80d8c2aed43468b02f18842b9dfeaa14e9e2bd6f99f53cf18a17d748df.try_into().unwrap(), tokenTotalSupply: u256 { low: 9070602400912917605, high: 0 }, selfAdrs: 0x123.try_into().unwrap() }));   
            // format hash:0x02ae62b66f63844803dd4c9f7095aa3e4f9c7bf61a1f759adf63e87f31c2e989
            set!(world, (Settings { key: 0, owner: get_caller_address(), pixelsRowCount: 30, pixelsColumnCount: 30, raiseTarget: u256 { low: 12917605, high: 0 }, quoteCurrency: 0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7.try_into().unwrap(), tokenHash: 0x02ae62b66f63844803dd4c9f7095aa3e4f9c7bf61a1f759adf63e87f31c2e989.try_into().unwrap(), tokenTotalSupply: u256 { low: 9070602400912917605, high: 0 } }));   
        }
    }

}