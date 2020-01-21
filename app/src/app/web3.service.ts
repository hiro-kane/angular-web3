import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { startWith } from 'rxjs/operators';
import { Observable, Subject, interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Web3Service {

  loginAccount: string = "";

  web3Subject: Subject<Web3> = new Subject();
  web3 = this.web3Subject.asObservable();
  accountSubject: Subject<string> = new Subject();
  account = this.accountSubject.asObservable();

  constructor() {
    window.addEventListener('load', async () => {
      // windowのethereumを取得
      const web3 = new Web3(window['ethereum']);

      // アカウント情報取得
      const accounts = await web3.eth.getAccounts();

      // 取得できたアカウント数でWalletがUnlock済か判定
      if (accounts.length === 0)
        return;

      // 取得できている場合はアカウント情報取得&監視処理を実行
      this.monitorChangeAccountByLoginAfter();

    });
  }

  /**
   * WalletUnlock
   */
  async　unlockWallet() {
    if (this.isUnlockWallet)
      return;

    console.log("unlock");
    try {
      // ログイン
      await window['ethereum'].enable();
      // 取得できている場合はアカウント情報取得&監視処理を実行
      this.monitorChangeAccountByLoginAfter();

    } catch (error) {

      return;
    }
  }

  /**
   * Walletアンロック済か判定
   */
  isUnlockWallet(): boolean {
    return (this.loginAccount !== "");
  }

  /**
   * ログイン後のアカウント変更監視
   */
  monitorChangeAccountByLoginAfter() {
    interval(3000).pipe(startWith(0)).subscribe(async n => {
      const web3 = new Web3(window['ethereum']);
      const accounts = await web3.eth.getAccounts();

      // アカウント情報の値変更を検知しWeb3情報を更新
      if (this.loginAccount !== accounts[0]) {
        // undefinedかどうかでアカウント切り変え or ログアウトを判定
        if (accounts[0] !== undefined) {
          this.loginAccount = accounts[0];
          this.web3Subject.next(web3);
          this.accountSubject.next(accounts[0]);
        } else {
          this.loginAccount = "";
          this.web3Subject.next(undefined);
          this.accountSubject.next(undefined);
        }
      }
    })
  }
}
