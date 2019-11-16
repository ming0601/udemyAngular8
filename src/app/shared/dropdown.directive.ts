import { Directive, HostListener, ElementRef, HostBinding, AfterViewChecked } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective implements AfterViewChecked {
  @HostBinding('class.show') isOpen = false;

  constructor(private elRef: ElementRef) {}

  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
  }

  ngAfterViewChecked() {
    if (this.isOpen === true) {
      const ul = this.elRef.nativeElement.querySelector('ul');
      if (ul !== null || ul !== undefined) {
        ul.classList.add('show');
      }
    } else {
      const ul = this.elRef.nativeElement.querySelector('ul');
      if (ul.classList.contains('show')) {
        ul.classList.remove('show');
      }
    }
  }
}
