import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() loadingFeature = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  loadFeature(feature: string) {
    this.loadingFeature.emit(feature);
  }
}
