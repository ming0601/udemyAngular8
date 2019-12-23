import { ViewContainerRef } from '@angular/core';
import { PlaceholderDirective } from './placeholder.directive';

describe('PlaceholderDirective', () => {
  const viewContainerRef = jasmine.createSpyObj('ViewContainerRef', ['createEmbeddedView']);
  it('should create an instance', () => {
    const directive = new PlaceholderDirective(viewContainerRef);
    expect(directive).toBeTruthy();
  });
});
