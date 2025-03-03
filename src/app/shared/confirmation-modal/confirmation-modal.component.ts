import { Component, EventEmitter, Input, Output } from '@angular/core';
declare var bootstrap: any;  // Required for Bootstrap modal handling

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent {
  @Input() message: string = "Are you sure you want to do this?";
  @Input() textButton: string = "Are you sure you want to do this?";
  @Input() title: string =""
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
