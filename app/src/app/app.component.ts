import { Component } from '@angular/core';
import { Web3Service } from './web3.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isUnlockWallet: boolean;
  currentAccount: string;

  constructor(private web3Service: Web3Service) { }

  ngOnInit() {
    this.web3Service.isUnlockWallet().subscribe(isUnlock => {
      console.log("isUnlockWallet subscribe", isUnlock)
      this.isUnlockWallet = isUnlock;
    });

    // this.web3Service.getCurrentAccount().subscribe(account => {
    //   console.log("subscribe account")
    //   console.log(account)
    //   this.currentAccount = account;
    // });
  }

  async unlock() {
    await this.web3Service.unlockWallet();

  }
}
