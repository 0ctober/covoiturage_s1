// Modules
import { NgModule, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, RequestOptions } from '@angular/http';
import { FormsModule } from '@angular/forms';

// Composants
import { CatchAnnonceComponent } from './catch-annonce/catch-annonce.component';
import { SearchAnnonceComponent } from './search-annonce/search-annonce.component';
import { SubscribeAnnonceComponent } from './subscribe-annonce/subscribe-annonce.component';

// Providers
import { AjaxSettingsService } from '../settings/ajax-settings.service';
import { ServicesService } from './services.service';
import { VillesService } from './search-annonce/villes.service';
import { CatchSingleService } from './catch-annonce/catch-single.service';
import { LoginService } from '../member/login/services.service';


// Composants
import { DisplayResultComponent } from './display-result/display-result.component';
import { GrabAnnonceService } from './display-result/grab-annonce.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CalendarModule } from 'primeng/primeng';
import { AutoCompleteModule } from 'primeng/primeng';

import { Routes, RouterModule } from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';



import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';

@NgModule({
	imports: [
		FormsModule,
		HttpModule,
		CommonModule,
		CalendarModule,
		AutoCompleteModule,
		AppRoutingModule,
		RouterModule,
				AgmCoreModule.forRoot({
	      apiKey: 'AIzaSyCm4g3sRwhhJBCtW2of8ta8VXpqNHEbb_Y'
	    }),
	    AgmDirectionModule,

	],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ], // Autorise les éléments importés 

	providers: [ ServicesService, AjaxSettingsService, VillesService, GrabAnnonceService, CatchSingleService, LoginService],
	declarations: [SearchAnnonceComponent, CatchAnnonceComponent, SubscribeAnnonceComponent, DisplayResultComponent]
})
export class AnnonceNavigationModule {

	// console.log('module : annonce-navigation [Loaded]');

}
