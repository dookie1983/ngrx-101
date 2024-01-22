import { Component } from '@angular/core';
import { StoreService } from '../store/store.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [CommonModule],
})
export class AppComponent {
  title = 'ngrx-101';
  constructor(public store: StoreService){
  }
}
