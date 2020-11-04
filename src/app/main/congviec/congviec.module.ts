import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CongviecComponent } from './congviec/Congviec.component';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [CongviecComponent, CongviecComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'congviec',
        component: CongviecComponent,
      },
  ]),  
  ]
})
export class CongviecModule { }
