import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoaivanbanComponent } from './vanban/Loaivanban.component';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [LoaivanbanComponent, LoaivanbanComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'loaivanban',
        component: LoaivanbanComponent,
      },
  ]),  
  ]
})
export class LoaivanbanModule { }
