import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PhongbanComponent } from './phongban/phongban.component';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [PhongbanComponent, PhongbanComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'phongban',
        component: PhongbanComponent,
      },
  ]),  
  ]
})
export class PhongbanModule { }
