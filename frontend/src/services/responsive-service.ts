import { Injectable, signal } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

@Injectable({ providedIn: 'root' })
export class ResponsiveService {

  screen = signal<'mobile' | 'tablet' | 'desktop'>('desktop');

  constructor(private bp: BreakpointObserver) {
    this.bp.observe([
      '(max-width: 979px)',
      '(min-width: 980px) and (max-width: 1399px)',
      '(min-width: 1400px)'
    ]).subscribe(state => {

      if (state.breakpoints['(max-width: 979px)']) {
        this.screen.set('mobile');

      } else if (state.breakpoints['(min-width: 980px) and (max-width: 1399px)']) {
        this.screen.set('tablet');

      } else {
        this.screen.set('desktop');
      }
    });
  }
}
