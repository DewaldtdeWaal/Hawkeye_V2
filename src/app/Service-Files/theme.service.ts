// theme.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentThemeKey = 'currentTheme';

  public theme: any
  public toolBackGround: any;

  toggleTheme() {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    localStorage.setItem(this.currentThemeKey, newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);

    this.theme = ThemeService.getTheme();
    this.toolBackGround = ThemeService.getToolTipBackGround();
  }

  getCurrentTheme(): string {
    return localStorage.getItem(this.currentThemeKey) || 'light';
  }

  public static getTheme() {
    let myTheme = localStorage.getItem("currentTheme")
    let theme
      if (myTheme == "dark"|| myTheme == "dark")
      {
        theme = '#FFFFFF';
      }
      else if (myTheme == "light" || myTheme == "light")
      {
        theme = '#797979';
      }

  return theme

  }
  
  public static getToolTipBackGround() {
    let myTheme = localStorage.getItem("currentTheme")
    let tooltipBackground
    
      if (myTheme == "dark"|| myTheme == "dark")
      {
        tooltipBackground = 'rgba(50,50,50,0.7)';
      }
      else if (myTheme == "light" || myTheme == "light")
      {
        tooltipBackground = 'rgba(255, 255, 255, 1)';
      }

  return  tooltipBackground

}

}
