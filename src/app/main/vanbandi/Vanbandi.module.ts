import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VanbandiComponent } from './vanbandi/Vanbandi.component';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [VanbandiComponent, VanbandiComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'vanbandi',
        component: VanbandiComponent,
      },
  ]),  
  ]
})
export class VanbandiModule { }
