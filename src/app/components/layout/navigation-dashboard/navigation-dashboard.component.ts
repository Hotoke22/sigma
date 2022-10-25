import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { navbarData } from './nav-data';

interface SideBarToggle{
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-navigation-dashboard',
  templateUrl: './navigation-dashboard.component.html',
  styleUrls: ['./navigation-dashboard.component.css']
})
export class NavigationDashboardComponent implements OnInit {

  /*
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  )

  constructor(private breakpointObserver: BreakpointObserver) {}
*/

isSidebarCollapsed= false;

  @Output() onToggleSideBar: EventEmitter<SideBarToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;

  onToggleSidebar(data: SideBarToggle):void{
    this.screenWidth = data.screenWidth;
    this.isSidebarCollapsed = data.collapsed;
  }

  toggleCollapse(): void{
    this.collapsed = !this.collapsed;
    this.onToggleSideBar.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  closeSidebar(): void {
    this.collapsed = false;
    this.onToggleSideBar.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});

  }

  ngOnInit(): void {
  }

}
