import { Component } from '@angular/core';
import { Web3Service } from './web3.service';
import { SimpleStorage } from './contract/simpleStorage';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  readonly NO_ACCOUNT_TEXT = 'No Account';
  readonly NOT_REF_SIMPLE_STORAGE = 'Unknown';

  isUnlockWallet: boolean = false;
  currentAccount: string = this.NO_ACCOUNT_TEXT;
  storageValue: string = this.NOT_REF_SIMPLE_STORAGE;
  setStorageNumber: number = 0;
  simpleStorage: SimpleStorage;

  constructor(private web3Service: Web3Service) { }

  ngOnInit() {
    this.web3Service.web3Subject.subscribe(web3 => {
      if (web3 !== undefined) {
        this.isUnlockWallet = this.web3Service.isUnlockWallet();
        this.currentAccount = (this.web3Service.getLoginAccount()) ? this.web3Service.getLoginAccount() : this.NO_ACCOUNT_TEXT;
        this.simpleStorage = this.web3Service.getSimpleStorage();
        this.getSimpleStorageValue();
      }
    })
  }

  /**
   * ウォレット解除
   */
  async unlock() {
    await this.web3Service.unlockWallet();
  }

  /**
   * SimpleStorageへ設定する数値設定
   * @param event 
   */
  setNumber(event: any) {
    // 数値に変換
    const value: number = Number(event.target.value)
    this.setStorageNumber = (isNaN(value)) ? 0 : value;
  }

  /**
   * スマートコントラクトにsetトランザクション発行
   */
  async setSimpleStorageValue() {
    if (!this.isUnlockWallet) return;
    const res = await this.simpleStorage.set(this.setStorageNumber, this.currentAccount)
    if (res)
      this.getSimpleStorageValue();
  }

  /**
   * スマートコントラクトに設定されている値を取得
   */
  async getSimpleStorageValue() {
    if (!this.isUnlockWallet) {
      this.storageValue = this.NOT_REF_SIMPLE_STORAGE;
      return;
    }
    this.storageValue = await this.simpleStorage.get();
  }
}
