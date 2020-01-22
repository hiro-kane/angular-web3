import Web3 from 'web3';
let simpleStorage = require('./abi/simpleStorage.abi.json');

export class SimpleStorage {

    contract: any;

    constructor(web3: Web3) {
        this.contract = new web3.eth.Contract(
            simpleStorage,
            "0x1E3222F5F44b5169E9Df0d7C283482fd734467E5"
        );
    }

    /**
     * get実行
     */
    async get(): Promise<string> {
        return await this.contract.methods.get().call();
    }

    /**
     * set実行
     */
    async set(value: number, account: string): Promise<boolean> {
        var res: boolean = false;
        await this.contract.methods.set(value).send({ from: account })
            .on('transactionHash', function (hash) {
                // トランザクション発行成功
                console.log("transactionHash")
            }.bind(this))
            .once('confirmation', function (confirmationNumber, receipt) {
                // トランザクション確定
                res = true;
            }.bind(this))
            .on('error', function (error, receipt) {
                // トランザクションエラー
                res = false;
            }.bind(this));

        return res;
    }
}