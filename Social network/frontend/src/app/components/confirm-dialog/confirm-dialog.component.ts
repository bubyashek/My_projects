import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="modal-overlay" (click)="onCancel()">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ title }}</h3>
          </div>
          
          <div class="modal-body">
            <p>{{ message }}</p>
          </div>
          
          <div class="modal-actions">
            <button class="btn-cancel" (click)="onCancel()">
              {{ cancelText }}
            </button>
            <button class="btn-confirm" (click)="onConfirm()">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-card {
      background: #ffffff;
      border-radius: 20px;
      padding: 0;
      width: 90%;
      max-width: 400px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .modal-header {
      padding: 24px 24px 16px;
      border-bottom: 1px solid #e2e8f0;
    }

    .modal-header h3 {
      margin: 0;
      color: #2c3e50;
      font-size: 20px;
      font-weight: 700;
    }

    .modal-body {
      padding: 24px;
    }

    .modal-body p {
      margin: 0;
      color: #4a5568;
      font-size: 16px;
      line-height: 1.6;
    }

    .modal-actions {
      padding: 16px 24px 24px;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .btn-cancel, .btn-confirm {
      padding: 10px 24px;
      border: none;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-cancel {
      background: #e2e8f0;
      color: #2d3748;
    }

    .btn-cancel:hover {
      background: #cbd5e0;
      transform: translateY(-1px);
    }

    .btn-confirm {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .btn-confirm:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
    }

    .btn-confirm.danger {
      background: linear-gradient(135deg, #fc8181 0%, #e53e3e 100%);
      box-shadow: 0 4px 12px rgba(252, 129, 129, 0.3);
    }

    .btn-confirm.danger:hover {
      box-shadow: 0 6px 16px rgba(252, 129, 129, 0.4);
    }
  `]
})
export class ConfirmDialogComponent {
  @Input() isOpen = false;
  @Input() title = 'Подтверждение';
  @Input() message = 'Вы уверены?';
  @Input() confirmText = 'Да';
  @Input() cancelText = 'Отмена';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
    this.isOpen = false;
  }

  onCancel(): void {
    this.cancelled.emit();
    this.isOpen = false;
  }
}

