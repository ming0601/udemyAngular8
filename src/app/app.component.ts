import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-8-complete';
  featureToLoad = 'recipe';

  loadHeaderFeature(feature: string) {
    this.featureToLoad = feature;
  }
}
