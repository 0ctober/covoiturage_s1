// MODULES
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';

import { BootstrapModule } from './bootstrap/bootstrap.module';
import { MemberModule } from './member/member.module';
import { AnnonceNavigationModule } from './annonce-navigation/annonce-navigation.module';

// COMPOSANTS
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
// A remplacer par le Ann-navigation/search-annonce
// import { HomeContentComponent } from './home-content/home-content.component';

// import 'hammerjs';

// OTHERS USEFUL STUFS
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

// Providers (SERVICE & GUARD)
import { LoginService } from './member/login/services.service';
import { AjaxSettingsService } from './settings/ajax-settings.service';
import { GuardMemberService } from './member/guard/guard-member.service';
import { GuardAdminService } from './member/guard/guard-admin.service';
import { AlreadyLoggedService } from './member/guard/already-logged.service';

// Routeur 
import { Routes, RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

// Material.IO


import {
	ReactiveFormsModule,
	FormsModule,
	FormGroup,
	FormControl,
	Validators,
	FormBuilder
} from '@angular/forms';


import {CalendarModule} from 'primeng/primeng';
import {AutoCompleteModule} from 'primeng/primeng';


@NgModule({
	declarations: [
		AppComponent,
		NavbarComponent,
		// HomeContentComponent,

	],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ], // Autorise les éléments importés 
	imports: [ 
		BrowserModule,
		BrowserAnimationsModule,
		CommonModule, 
		FormsModule,
		ReactiveFormsModule,
		HttpModule,
		BootstrapModule,
		AppRoutingModule,
		CalendarModule,
		AutoCompleteModule,
		AnnonceNavigationModule,
		MemberModule
			],
	providers: [
		LoginService,
		AjaxSettingsService,
		GuardMemberService, 
		GuardAdminService, 
		AlreadyLoggedService
	],
	bootstrap: [AppComponent]
	})
export class AppModule { }
