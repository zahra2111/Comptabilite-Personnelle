import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth/auth.service';
import { TransactionService } from '../../services/transaction/transaction.service';
import { TierService } from '../../services/tier/tier.service';
import { CompteBancaireService } from '../../services/CompteBancaire/compte-bancaire.service';
import { Tier } from '../../services/tier/Tier';
import { BankAccount } from '../../services/CompteBancaire/compteBancaire';
import { UserService } from '../../services/User/user.service';
import {  EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-crediter-popup',
  templateUrl: './crediter-popup.component.html',
  styleUrls: ['./crediter-popup.component.scss']
})
export class CrediterPopupComponent implements OnInit {
  @Output() transactionAdded = new EventEmitter<void>();

  creditForm: FormGroup;
  tiers: Tier[] = [];
  comptes: BankAccount[] = [];
  selectedTierId: number | null = null;
  selectedCompteId: number | null = null;
  userIden: number | 0 = 0;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private transactionService: TransactionService,
    private tierService: TierService,
    private compteBancaireService: CompteBancaireService,
    private snackBar: MatSnackBar,
    private userService: UserService,
    public dialogRef: MatDialogRef<CrediterPopupComponent>
  ) {
    this.creditForm = this.fb.group({
      date: ['', Validators.required],
      description: ['', Validators.required],
      mode: ['', Validators.required],
      amount: ['', Validators.required],
      tiers: ['', Validators.required],
      compte: ['', Validators.required],
      ref: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.getCurrentUserId().subscribe(id => {
      this.userIden = id;
      console.log('User ID:', this.userIden);
    });
    this.loadTiers();
    this.loadComptes();
  }

  loadTiers(): void {
    this.authService.getCurrentUserId().subscribe(userId => {
      if (userId) {
        this.tierService.getTiers().subscribe(tiers => {
          this.tiers = tiers.map((t: any) => new Tier(
            t.nom,
            t.adresse,
            t.commentaire,
            t.usr,
            t.transactions,
            t.id
          ));
        }, error => {
          console.error('Error fetching tiers:', error);
          this.snackBar.open('Error fetching tiers', 'Close', { duration: 2000 });
        });
      } else {
        console.error('User ID is not available');
        this.snackBar.open('User ID is not available. Please log in again.', 'Close', { duration: 2000 });
      }
    }, error => {
      console.error('Error fetching user ID:', error);
      this.snackBar.open('Error fetching user ID. Please try again later.', 'Close', { duration: 2000 });
    });
  }

  loadComptes(): void {
    this.authService.getCurrentUserId().subscribe(userId => {
      if (userId) {
        this.userService.getBanks(userId).subscribe(comptes => {
          this.comptes = comptes;
        }, error => {
          console.error('Error fetching comptes:', error);
        });
      } else {
        console.error('User ID is not available');
      }
    }, error => {
      console.error('Error fetching user ID:', error);
    });
  }

  onSubmit(): void {
    if (this.selectedTierId !== null && this.selectedCompteId !== null) {
      const formValue = this.creditForm.value;
      const tierId = this.selectedTierId;
      const compteId = this.selectedCompteId;

      const transactionData = {
        date: formValue.date,
        Notes: formValue.description,
        amount: parseFloat(formValue.amount),
        type: 'credit',
        tiers: `api/tiers/${tierId}`,
        usr: `api/users/${this.userIden}`,
        Compte: `api/banks/${compteId}`,
        ref: formValue.ref
      };

      this.transactionService.addTransaction(transactionData).subscribe(
        response => {
          console.log('Transaction added successfully', response);
          this.snackBar.open('Transaction added successfully', 'Close', { duration: 2000 });
          this.transactionAdded.emit(); // Emit event after successful addition

          this.closePopup();
        },
        error => {
          console.error('Error adding transaction', error);
          this.snackBar.open('Error adding transaction', 'Close', { duration: 2000 });
        }
      );
    } else {
      this.snackBar.open('Please select a tier and a compte', 'Close', { duration: 2000 });
    }
  }

  closePopup(): void {
    this.dialogRef.close();
  }

  onTierChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedTierId = target.value ? parseInt(target.value, 10) : null;
  }

  onCompteChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedCompteId = target.value ? parseInt(target.value, 10) : null;
  }
}
