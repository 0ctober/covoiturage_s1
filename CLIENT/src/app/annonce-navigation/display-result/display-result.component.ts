import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GrabAnnonceService } from './grab-annonce.service';
import { ActivatedRoute, Params, Router, Routes, RouterModule } from '@angular/router';
import { VillesService } from '../search-annonce/villes.service'; // TODELETE
import { Observable } from 'rxjs';

@Component({
	selector: 'app-display-result',
	templateUrl: './display-result.component.html',
	styleUrls: ['./display-result.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class DisplayResultComponent implements OnInit {

	constructor(
		private villesService:VillesService,
		private route:ActivatedRoute,
		private router:Router,
		private grabAnnonce:GrabAnnonceService
		) {
		
		console.log('[DisplayResultComponent] > constructor ');
		
		this.route.params.subscribe(
			(params: Params) => {
				this.depart = params.depart;
				this.arrivee = params.arrivee;
				this.datetime = new Date(params.datetime);
				this.order = params.order;

				this.grabAnnonce.search(params.depart, params.arrivee, params.datetime, params.order, 
					res=> {
						this.annonces = res;
						this.resultats = res.length;
					})
			})
	}

	 filterCountrySingle(event) {
        let query = event.query;
        this.villesService.getVilles(query, (result)=>{
        	this.filteredCountriesSingle = result;
        });
	}

	changeOrder(value){

		this.router.navigate(['/search', {'depart':this.depart, 'arrivee':this.arrivee , 'datetime':this.datetime.toISOString(), 'order':value}]);
	}

	annonces;
	resultats = 0;
	order: number;
	depart = "";
	arrivee = "";
	datetime : Date; // Récupéré par l'url et par databinding

	datetimer : Date; // Récupéré par l'url et par databinding
	departr = "";
	arriveer = "";
	// Paramètres pour la gestion des dates
	fr:any;
    rangeDates: Date[];
    invalidDates: Array<Date>;
    countries: any[];
    filteredCountriesSingle: any[];

	ngOnInit(){
		console.log('[DisplayResultComponent] > ngOnInit ');

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
