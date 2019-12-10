import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthComponent } from './auth.component';
import { SharedModule } from './../shared/shared.module';

@NgModule({
    declarations: [
        AuthComponent
    ],
    imports: [
        RouterModule.forChild([
            {path: 'auth', component: AuthComponent}
        ]),
        SharedModule,
        FormsModule,
        CommonModule
    ]
})
export class AuthModule {}
