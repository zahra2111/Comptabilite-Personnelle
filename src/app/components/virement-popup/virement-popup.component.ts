import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-virement-popup',
  templateUrl: './virement-popup.component.html',
  styleUrls: ['./virement-popup.component.scss']
})
export class VirementPopupComponent implements OnInit {
  virementForm: FormGroup;

  constructor(private popupService: PopupService, private fb: FormBuilder) {
    this.virementForm = this.fb.group({
      date: ['', Validators.required],
      description: ['', Validators.required],
      mode: ['', Validators.required],
      tiers: ['', Validators.required],
      categories: ['', Validators.required],
      ref: ['', Validators.required],
      duCompte: ['', Validators.required],
      versLeCompte: ['', Validators.required],
      type: ['virement', Validators.required]
    });
  }

  ngOnInit(): void {}

  closePopup() {
    this.popupService.closePopup('virement');
  }

  onSubmit() {
    if (this.virementForm.valid) {
      console.log(this.virementForm.value);
      this.closePopup(); // Close popup after submission
    }
  }
}
