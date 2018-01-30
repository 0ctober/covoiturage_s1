import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Les composants
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LogoutComponent } from './logout/logout.component';
import { PanelComponent } from './panel/panel.component';
import { CreateAnnonceComponent } from './create-annonce/create-annonce.component';
import { ModifyUserComponent } from './modify-user/modify-user.component';
// Les services - providers
import { LoginService } from './login/services.service';
import { AjaxSettingsService } from '../settings/ajax-settings.service';
import { VillesService } from '../annonce-navigation/search-annonce/villes.service';
import { MapApiService } from './create-annonce/map-api.service'
// Les forms
import {
    ReactiveFormsModule,
    FormsModule,
    FormGroup,
    FormControl,
    Validators,
    FormBuilder
} from '@angular/forms';
// Module primeng
import { CalendarModule } from 'primeng/primeng';
import { AutoCompleteModule } from 'primeng/primeng';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
// Les routings
import { Routes, RouterModule } from '@angular/router';
import { MemberRoutingModule } from './member-routing.module';
// Modules AGM (angular google map)
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { TrajetTypeComponent } from './trajet-type/trajet-type.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule, 
        ReactiveFormsModule, 
        RouterModule, 
        MemberRoutingModule,
        CalendarModule,
        AutoCompleteModule
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ], // Autorise les éléments importés 
	providers: [  LoginService , AjaxSettingsService, VillesService, MapApiService	],
	declarations: [LoginComponent, RegisterComponent, PanelComponent, LogoutComponent, CreateAnnonceComponent, ModifyUserComponent, TrajetTypeComponent]
})
export class MemberModule { }
