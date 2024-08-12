import { Component, OnInit } from '@angular/core';
import { CompteBancaireService } from '../../services/CompteBancaire/compte-bancaire.service';
import { BankAccount } from '../../services/CompteBancaire/compteBancaire';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/User/user.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component'; // Update the import path as needed
import { MatSnackBar } from '@angular/material/snack-bar'; // Optional for showing messages

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.css']
})
export class BankAccountComponent implements OnInit {

  userInfo: any = {};

  comptes: BankAccount[] = [];
  showPopup: boolean = false;
  editingBankAccount: BankAccount | null = null;
  userId: number| 0 = 0;

  constructor(
    private translate: TranslateService,
    private compteBancaireService: CompteBancaireService,
    private authService: AuthService,
    private userService: UserService,
    private dialog: MatDialog ,// Inject MatDialog
    private snackBar: MatSnackBar,
  )
   {
 
   }
  searchQuery: string = '';

  // Method to filter bank accounts based on search query
  filteredComptes() {
    if (!this.searchQuery) {
      return this.comptes;
    }
    const query = this.searchQuery.toLowerCase();
    return this.comptes.filter(compte =>
      compte.nom.toLowerCase().includes(query) ||
      compte.type.toLowerCase().includes(query)
    );
    
  }
  ngOnInit(): void {
    this.translate.setDefaultLang('fr');

    this.getComptes();
    this.authService.getCurrentUserId().subscribe(id => {
      this.userId = id;
      console.log('User ID:', this.userId);
    });
  }

  getComptes(): void {
    this.authService.getCurrentUserId().subscribe(userId => {
      if (userId) {
        this.userService.getBanks(userId).subscribe(budgets => {
          this.comptes = budgets;
        }, error => {
          console.error('Error fetching budgets:', error);
     
        });
      } else {
        console.error('User ID is not available');
  
      }
    }, error => {
      console.error('Error fetching user ID:', error);
  
    });
  }


  openPopup(bankAccount?: BankAccount): void {
    this.editingBankAccount = bankAccount ? { ...bankAccount } : null;
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
    this.editingBankAccount = null;
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
    const bank = new BankAccount(form.value.nom, parseFloat(form.value.initialSum), form.value.type, form.value.monnie , `api/users/${this.userId}`);

      if (this.editingBankAccount) {
        // Update existing bank account
        this.compteBancaireService.modifyCompteBancaire(this.editingBankAccount.id!, bank)
          .subscribe(response => {
            console.log('Bank account updated successfully', response);
            this.getComptes(); // Refresh the list
            this.closePopup(); // Close the popup
          }, error => {
            console.error('Error updating bank account', error);
          });
      } else {
        // Add new bank account
        this.compteBancaireService.addCompteBancaire(bank)
          .subscribe(response => {
            console.log('Bank account added successfully', response);
            this.getComptes(); // Refresh the list
            this.closePopup(); // Close the popup
          }, error => {
            console.error('Error adding bank account', error);
          });
      }

      form.resetForm();
    }
  }
  deleteBankAccount(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '300px',
      data: {
        title: 'DELETE_CONFIRMATION_COMPTE',
        message: 'DELETE_CONFIRMATION_MESSAGE_BANK'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.compteBancaireService.deleteCompteBancaire(id)
          .subscribe(response => {
            this.snackBar.open(this.translate.instant('BANK_DELETE_SUCCESS'), this.translate.instant('CLOSE'), { duration: 2000 });
            this.getComptes(); // Refresh the list
          }, error => {
            this.snackBar.open(this.translate.instant('BANK_DELETE_FAIL'), this.translate.instant('CLOSE'), { duration: 2000 });

            console.error('Error deleting bank account', error);
          });
      }
    });
  }
}
