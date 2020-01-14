import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  // web3: Web3 = null;
  web3: Observable<Web3>
  // account: string;
  account: Observable<string>;


  constructor() {

    window.addEventListener('load', async () => {
      // windowのethereumを取得
      const web3 = new Web3(window['ethereum']);

      // アカウント情報取得
      const accounts = await web3.eth.getAccounts();

      // 取得できたアカウント数でWalletがUnlock済か判定
      if (accounts.length === 0)
        return;

      console.log('get web3', web3, accounts[0])
      // 取得できている場合はweb3とアカウントを詰める
      this.web3 = of(web3);
      this.account = of(accounts[0]);

    });
  }

  /**
   * WalletUnlock
   */
  async　unlockWallet() {
    const web3 = new Web3(window['ethereum']);
    try {
      // ログイン
      await window['ethereum'].enable();
    } catch (error) {
      return;
    }
    // ログインに成功した場合
    const accounts = await web3.eth.getAccounts();

    this.web3 = of(web3);
    this.account = of(accounts[0]);
  }

  /**
   * アカウント取得
   */
  // getCurrentAccount(): string {
  getCurrentAccount(): Observable<string> {
    console.log('getAcc', this.account)
    return this.account;
  }

  /**
   * アカウント取得
   */
  // isUnlockWallet(): boolean {
  isUnlockWallet(): Observable<boolean> {

    console.log('isUnlockWallet', this.web3, (this.web3 !== undefined))
    return of((this.web3 !== undefined));
  }

  test() {
    this.web3 = of(new Web3(window['ethereum']));
  }
}
