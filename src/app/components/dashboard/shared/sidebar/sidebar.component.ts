import { Component, HostListener, Input, OnInit } from '@angular/core';
import { RolesEnum } from 'src/app/core/enums/roles.enum';
import { StorageService } from 'src/app/core/services/storage.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    // trigger('fold', [
    //   state('in', style({ height: 'calc(100vh - 150px)', marginTop: '150px' })),
    //   state('out', style({ height: 'calc(100vh - 70px)', marginTop: '70px' })),
    //   transition('* => *', [animate(300)]),
    // ]),
    // trigger('fold', [
    //   transition(':enter', [
    //     style({ height: 'calc(100vh - 150px)', overflow: 'hidden' }),
    //     animate('.3s ease', style({ height: 'calc(100vh - 70px)' })),
    //   ]),
    //   transition(':leave', [
    //     style({ height: 'calc(100vh - 70px)', overflow: 'hidden' }),
    //     animate('.3s ease', style({ height: 'calc(100vh - 150px)' })),
    //   ]),
    // ]),
  ],
})
export class SidebarComponent implements OnInit {
  // @Input() mobile: boolean = false;

  @Input() isAdmin!: boolean;
  @Input() isUser!: boolean;
  @Input() isRemax!: boolean;
  public scrolled: boolean = false;
  public state: string = 'in';

  constructor(public commonService: CommonService) {}

  ngOnInit(): void {}

  @HostListener('document:scroll')
  scrollFunction() {
    this.scrolled =
      document.body.scrollTop > 0 || document.documentElement.scrollTop > 0;
    this.state = this.scrolled ? 'out' : 'in';
  }
}
