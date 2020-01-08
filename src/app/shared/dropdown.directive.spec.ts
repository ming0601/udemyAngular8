import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownDirective } from './dropdown.directive';
import { Component, DebugElement, AfterViewChecked } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('DropdownDirective', () => {
  let component: TestDropdownComponent;
  let fixture: ComponentFixture<TestDropdownComponent>;
  let dropDownEl: DebugElement;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
        declarations: [ DropdownDirective, TestDropdownComponent ]
      });
    fixture = TestBed.createComponent(TestDropdownComponent);
    component = fixture.componentInstance;
    dropDownEl = fixture.debugElement.query(By.css('div'));
});

  // fit('should show elements on toggle', () => {
  //   // dropDownEl.triggerEventHandler('document:click', ['$event']);
  //   component.ngAfterViewChecked();
  //   fixture.detectChanges();
  //   fixture.whenStable().then(() => {

  //   });
  //   element = fixture.nativeElement;
  //   const div = element.querySelector('div');
  //   expect(div.className).toContain('show');
  //   // console.log(dropDownEl.nativeElement.hasClass('show'));
  //   // expect(dropDownEl.nativeElement).toBeTruthy();
  // });
});

@Component({
    template: `
        <div class="btn-group" appDropdown>
            <button type="button" class="btn btn-primary dropdown-toggle">
                Manage Recipe
                <span class="caret"></span>
            </button>
            <ul class="dropdown-menu">
                <li><a style="cursor: pointer;">To Shopping List</a></li>
                <li><a style="cursor: pointer;">Edit Recipe</a></li>
                <li><a style="cursor: pointer;">Delete Recipe</a></li>
            </ul>
        </div>
    `
})
class TestDropdownComponent implements AfterViewChecked {
    ngAfterViewChecked() {}
}
