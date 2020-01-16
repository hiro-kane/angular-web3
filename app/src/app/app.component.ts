import { Component } from '@angular/core';
import { Web3Service } from './web3.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isUnlockWallet: boolean = false;
  currentAccount: string = 'no account';

  constructor(private web3Service: Web3Service) { }

  ngOnInit() {
    this.web3Service.web3.subscribe(web3 => {
      this.isUnlockWallet = this.web3Service.isUnlockWallet()
    })

    this.web3Service.account.subscribe(account => {
      this.currentAccount = account;
    })
  }

  async unlock() {
    await this.web3Service.unlockWallet();

  }
}
