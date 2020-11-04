import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VanbanComponent } from './vanban/Vanban.component';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [VanbanComponent, VanbanComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'vanban',
        component: VanbanComponent,
      },
  ]),  
  ]
})
export class VanbanModule { }
