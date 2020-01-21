import { Component } from '@angular/core';
import { Web3Service } from './web3.service';

// import { simpleStorageAbi } from './define/simpleStorage.abi';
let simpleStorage = require('./define/simpleStorage.abi.json');
import Web3 from 'web3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isUnlockWallet: boolean = false;
  currentAccount: string = 'no account';
  web3: Web3;
  storageValue: string = "0";
  setStorageValue: number = 0;

  constructor(private web3Service: Web3Service) { }

  ngOnInit() {
    this.web3Service.web3.subscribe(web3 => {
      this.web3 = web3;
      this.isUnlockWallet = this.web3Service.isUnlockWallet()
    })

    this.web3Service.account.subscribe(account => {
      this.currentAccount = account;
    })
  }

  async unlock() {
    await this.web3Service.unlockWallet();

  }

  setNumber(event: any) {
    // 数値に変換
    const value: number = Number(event.target.value)
    this.setStorageValue = (isNaN(value)) ? 0 : value;
  }

  async set() {
    const contract = new this.web3.eth.Contract(
      simpleStorage,
      "0x1E3222F5F44b5169E9Df0d7C283482fd734467E5"
    );

    contract.methods.set(this.setStorageValue).send({ from: this.currentAccount })
      .on('transactionHash', function (hash) {
        // トランザクション発行成功
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        // トランザクション確定

      })
      .on('error', function (error, receipt) {
        // トランザクションエラー

      });
  }

  async get() {
    const contract = new this.web3.eth.Contract(
      simpleStorage,
      "0x1E3222F5F44b5169E9Df0d7C283482fd734467E5"
    );

    const number = await contract.methods.get().call();
    console.log(number);
    this.storageValue = number;
  }


}
