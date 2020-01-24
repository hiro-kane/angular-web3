import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { startWith } from 'rxjs/operators';
import Web3 from 'web3';

import { SimpleStorage } from './contract/simpleStorage';

@Injectable({
  providedIn: 'root'
})
export class Web3Service {

  loginAccount: string = undefined;
  web3Subject: BehaviorSubject<Web3> = new BehaviorSubject<Web3>(undefined);

  constructor() {
    window.addEventListener('load', async () => {
      // metamaskアプリを登録していない場合は処理しない
      if (!this.existsWeb3App()) return;

      // windowのethereumを取得
      const web3 = new Web3(window['ethereum']);
      // アカウント情報取得
      const accounts = await web3.eth.getAccounts();

      // アカウントが取得できたかどうかでロック中か判定
      if (accounts[0] === undefined)
        return;

      // 取得できている場合はアカウント情報取得&監視処理を実行
      this.monitorChangeAccountByLoginAfter();
    });
  }

  /**
   * WalletUnlock
   */
  async unlockWallet() {
    // metamaskアプリを登録していない場合は処理しない
    if (!this.existsWeb3App()) return;

    // アンロック済の場合は処理しない
    if (this.isUnlockWallet()) return;

    try {
      // ログイン
      await window['ethereum'].enable();
      // 取得できている場合はアカウント情報取得&監視処理を実行
      this.monitorChangeAccountByLoginAfter();

    } catch (error) { }
  }

  /**
   * Walletアンロック済か判定
   */
  isUnlockWallet(): boolean {
    return (this.loginAccount !== undefined);
  }

  /**
   * Web3連携アプリが登録されているか確認
   */
  existsWeb3App(): boolean {
    return (window['ethereum'] !== undefined);
  }

  /**
   * ログイン済アカウント取得
   */
  getLoginAccount(): string {
    if (!this.isUnlockWallet()) return;
    return this.loginAccount;
  }

  /**
   * SimpleStorageコントラクトのインスタンス取得
   */
  getSimpleStorage(): SimpleStorage {
    if (!this.isUnlockWallet()) return;
    return new SimpleStorage(this.web3Subject.getValue())
  }

  /**
   * ログイン後のアカウント変更監視
   */
  monitorChangeAccountByLoginAfter() {
    const moniter = interval(3000).pipe(startWith(0)).subscribe(async n => {
      const web3 = new Web3(window['ethereum']);
      const accounts = await web3.eth.getAccounts();

      // アカウント情報の値変更を検知しWeb3情報を更新
      if (this.loginAccount !== accounts[0]) {
        this.loginAccount = accounts[0];
        this.web3Subject.next(web3);

        // ログアウトの場合は監視終了
        if (accounts[0] === undefined) {
          // ログアウト
          moniter.unsubscribe();
        }
      }
    })
  }
}
