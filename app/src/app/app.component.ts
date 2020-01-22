import { Component } from '@angular/core';
import { Web3Service } from './web3.service';
import { SimpleStorage } from './contract/simpleStorage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isUnlockWallet: boolean = false;
  currentAccount: string = 'no account';
  storageValue: string = "0";
  setStorageValue: number = 0;
  simpleStorage: SimpleStorage;

  constructor(private web3Service: Web3Service) { }

  ngOnInit() {
    this.web3Service.web3Subject.subscribe(web3 => {
      if (web3 !== undefined) {
        this.isUnlockWallet = this.web3Service.isUnlockWallet();
        this.currentAccount = this.web3Service.getLoginAccount();
        this.simpleStorage = this.web3Service.getSimpleStorage();
        this.get()
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
   * 数値設定
   * @param event 
   */
  setNumber(event: any) {
    // 数値に変換
    const value: number = Number(event.target.value)
    this.setStorageValue = (isNaN(value)) ? 0 : value;
  }

  /**
   * スマートコントラクトにsetトランザクション発行
   */
  async set() {
    if (!this.isUnlockWallet) return;
    if (await this.simpleStorage.set(this.setStorageValue, this.currentAccount))
      this.get();
  }

  /**
   * スマートコントラクトに設定されている値を取得
   */
  private async get() {
    if (!this.isUnlockWallet) {
      this.storageValue = "";
      return;
    }
    this.storageValue = await this.simpleStorage.get();
  }

}
