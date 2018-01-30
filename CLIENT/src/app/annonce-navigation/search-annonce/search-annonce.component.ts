// import {ChangeDetectionStrategy} from '@angular/core';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AjaxSettingsService } from '../../settings/ajax-settings.service';
import { ServicesService } from '../services.service';
// import { FormControl } from '@angular/forms';
import { VillesService } from './villes.service';
import { Location, NgClass } from '@angular/common';
import { Observable } from 'rxjs';

// Router pour activer la recherche après validation du pseudo-formulaire
import { ActivatedRoute, Params, Router, Routes } from '@angular/router';



@Component({
	selector: 'app-search-annonce',
	templateUrl: './search-annonce.component.html',
	styleUrls: ['./search-annonce.component.css'],
	providers: [  ServicesService, AjaxSettingsService, VillesService],
	encapsulation: ViewEncapsulation.None
})
export class SearchAnnonceComponent implements OnInit {

	constructor(
		private router: Router,
		private villesService:VillesService,
		private location:Location
	){}

	date: Date;
	fr:any;
    rangeDates: Date[];
    invalidDates: Array<Date>;
    depart: any ;
    arrivee: any ;
    countries: any[];
    filteredCountriesSingle: any[];

    // Permet de cacher l'accueil lorsqu'on invoke une sub-Route
    isHidden() {
		let list = "/search", route = this.location.path();

		return route.includes(list) || route.includes("/annonce");
	}

    filterCountrySingle(event) {
        let query = event.query;
        this.villesService.getVilles(query, (result)=>{
        	this.filteredCountriesSingle = result;
        });
	}

	searchAnnonce(){
		if(this.depart != undefined && this.depart/*.name*/ != "" && 
			this.arrivee != undefined && this.arrivee/*.name*/ != "" && 
			this.date != undefined && this.date.toISOString() != ""){
			console.log('[searchAnnonce] > service > search()');
			this.router.navigate(['/search', {'depart':this.depart/*.name*/, 'arrivee':this.arrivee/*.name*/ , 'datetime':this.date.toISOString(), 'order':0}]);
		}
	}

	ngOnInit() {
		this.fr = {
            firstDayOfWeek: 1,
            dayNames: [ "dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi" ],
            dayNamesShort: [ "dim","lun","mar","mer","jeu","ven","sam" ],
            dayNamesMin: [ "D","L","M","M","J","V","S" ],
            monthNames: [ "janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre" ],
            monthNamesShort: [ "jan","fév","mar","avr","mai","jui","jui","aoû","sep","oct","nov","déc" ],
            today: "aujourd'hui",
            clear: 'Éffacer'
        };

        // this.tr = {
        //     firstDayOfWeek : 1
        // };
        // this.date = new Date();
        let today = new Date();
        let month = today.getMonth();
        let year = today.getFullYear();
        let prevMonth = (month === 0) ? 11 : month -1;
        let prevYear = (prevMonth === 11) ? year - 1 : year;
        let nextMonth = (month === 11) ? 0 : month + 1;
        let nextYear = (nextMonth === 0) ? year + 1 : year;
        let invalidDate = new Date();
        invalidDate.setDate(today.getDate() - 1);
        this.invalidDates = [today,invalidDate];
	}
}