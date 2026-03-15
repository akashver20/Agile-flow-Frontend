import { Component, Output, EventEmitter, ViewChild, ElementRef, forwardRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rich-text-editor">
      <div class="editor-toolbar">
        <button type="button" class="toolbar-btn" (click)="format('bold')" title="Bold">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
          </svg>
        </button>
        <button type="button" class="toolbar-btn" (click)="format('italic')" title="Italic">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="4" x2="10" y2="4"></line>
            <line x1="14" y1="20" x2="5" y2="20"></line>
            <line x1="15" y1="4" x2="9" y2="20"></line>
          </svg>
        </button>
        <div class="toolbar-divider"></div>
        <button type="button" class="toolbar-btn" (click)="format('insertUnorderedList')" title="Bullet List">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
        </button>
        <button type="button" class="toolbar-btn" (click)="format('insertOrderedList')" title="Numbered List">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="10" y1="6" x2="21" y2="6"></line>
            <line x1="10" y1="12" x2="21" y2="12"></line>
            <line x1="10" y1="18" x2="21" y2="18"></line>
            <path d="M4 6h1v4"></path>
            <path d="M4 10h2"></path>
            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
          </svg>
        </button>
      </div>
      <div 
        class="editor-content" 
        contenteditable="true" 
        #editorContent
        (input)="onInput()"
        (blur)="onTouched()"
        [attr.placeholder]="placeholder">
      </div>
      <div class="editor-footer" *ngIf="showSubmit">
        <button type="button" class="btn-submit" (click)="submit()" [disabled]="!hasContent()">
          {{ submitLabel }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .rich-text-editor {
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--color-bg-primary);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: all 0.2s ease;
    }

    .rich-text-editor:focus-within {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px hsl(234 89% 63% / 0.12);
    }

    .editor-toolbar {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.5rem;
      border-bottom: 1px solid var(--color-border);
      background: var(--color-bg-secondary);
    }

    .toolbar-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 4px;
      border: none;
      background: transparent;
      color: var(--color-text-secondary);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .toolbar-btn:hover {
      background: var(--color-border);
      color: var(--color-text-primary);
    }

    .toolbar-divider {
      width: 1px;
      height: 20px;
      background: var(--color-border);
      margin: 0 0.25rem;
    }

    .editor-content {
      min-height: 100px;
      max-height: 300px;
      overflow-y: auto;
      padding: 0.75rem;
      color: var(--color-text-primary);
      font-size: 0.875rem;
      line-height: 1.5;
      outline: none;
    }

    .editor-content[placeholder]:empty:before {
      content: attr(placeholder);
      color: var(--color-text-tertiary);
      pointer-events: none;
      display: block;
    }

    /* Standard rich text styles mapping */
    .editor-content ::ng-deep b, .editor-content ::ng-deep strong { font-weight: 600; }
    .editor-content ::ng-deep i, .editor-content ::ng-deep em { font-style: italic; }
    .editor-content ::ng-deep ul { list-style-type: disc; padding-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 0.5rem; }
    .editor-content ::ng-deep ol { list-style-type: decimal; padding-left: 1.5rem; margin-top: 0.5rem; margin-bottom: 0.5rem; }

    .editor-footer {
      display: flex;
      justify-content: flex-end;
      padding: 0.5rem;
      border-top: 1px solid var(--color-border);
      background: var(--color-bg-secondary);
    }

    .btn-submit {
      background: var(--gradient-primary);
      color: white;
      border: none;
      padding: 0.375rem 0.875rem;
      border-radius: var(--radius-sm);
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-submit:hover:not(:disabled) {
      opacity: 0.9;
    }

    .btn-submit:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      filter: grayscale(1);
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true
    }
  ]
})
export class RichTextEditorComponent implements ControlValueAccessor {
  @ViewChild('editorContent') editorContent!: ElementRef<HTMLDivElement>;
  
  @Input() placeholder: string = 'Add a comment...';
  @Input() showSubmit: boolean = false;
  @Input() submitLabel: string = 'Save';

  @Output() onSubmit = new EventEmitter<string>();

  private value: string = '';
  
  onChange = (value: string) => {};
  onTouched = () => {};

  format(command: string) {
    document.execCommand(command, false, '');
    this.editorContent.nativeElement.focus();
    this.onInput();
  }

  onInput() {
    const html = this.editorContent.nativeElement.innerHTML;
    this.value = html;
    this.onChange(html);
  }

  writeValue(value: string): void {
    this.value = value || '';
    if (this.editorContent) {
      this.editorContent.nativeElement.innerHTML = this.value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  hasContent(): boolean {
    if (!this.editorContent?.nativeElement) return false;
    const text = this.editorContent.nativeElement.textContent || '';
    return text.trim().length > 0;
  }

  submit() {
    if (this.hasContent()) {
      this.onSubmit.emit(this.value);
    }
  }

  clear() {
    this.value = '';
    if (this.editorContent) {
      this.editorContent.nativeElement.innerHTML = '';
    }
    this.onChange('');
  }
}
