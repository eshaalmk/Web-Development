import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-child',
  standalone: true,
  templateUrl: './child.html',
})
export class ChildComponent {
  @Input() parentMessage: string = "";
}