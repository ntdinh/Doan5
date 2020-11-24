import { Component, OnInit, AfterViewInit } from '@angular/core';
declare let $: any;
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, AfterViewInit {
  public menus = [
  {name :'Người dùng', url:'',icon:'user',childs:[{name:'Quản lý người dùng',url:'user/user'}]},
  
  {name :'Quản lí chung', url:'',icon:'user',childs:[{name:'Quản lý số văn bản',url:'vanban/vanban'},
  {name:'Quản lý loại văn bản',url:'loaivanban/loaivanban'},
  {name:'Quản lý phòng ban',url:'phongban/phongban'},
  {name:'Quản lý công việc',url:'congviec/congviec'},
  {name:'Quản lý văn bản đi',url:'vanbandi/vanbandi'},
  {name:'Nhận diện văn bản',url:'ocr/ocr'}
   ]}];
  
  constructor() { } 
  ngOnInit(): void {
  }
  ngAfterViewInit() {
    $('#sidebar-collapse').click(function () {
      setTimeout(() => {
        let event;
        if (typeof (Event) === 'function') {
          event = new Event('resize');
        } else {
          event = document.createEvent('Event');
          event.initEvent('resize', true, true);
        }
        window.dispatchEvent(event);
      }, 100);
      if (!$('#sidebar').hasClass('menu-min')) {
        $('.main-content').css('padding-left', '43px');
        $('.footer-inner').css('left', '43px');
      } else {
        $('.main-content').css('padding-left', '190px');
        $('.footer-inner').css('left', '190px');
      }
    });
    setTimeout(() => {
      let event;
      if (typeof (Event) === 'function') {
        event = new Event('resize');
      } else {
        event = document.createEvent('Event');
        event.initEvent('resize', true, true);
      }
      window.dispatchEvent(event);
    }, 100);
    setTimeout(() => {
      $('.main-content').css('padding-left', $('#sidebar').width() + 1);
      $('.footer-inner').css('left', $('#sidebar').width() + 1);
    }, 100);
  }
}
