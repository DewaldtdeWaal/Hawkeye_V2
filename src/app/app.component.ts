import { Component } from '@angular/core';
import { ThemeService } from 'src/app/Service-Files/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  
{
  
  constructor(private themeService: ThemeService) { }
  
  ngOnInit() {
    document.documentElement.setAttribute('data-theme', this.themeService.getCurrentTheme());
  }
}


