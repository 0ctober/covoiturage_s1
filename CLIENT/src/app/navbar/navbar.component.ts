import { Component, Input, OnInit, Output, ChangeDetectorRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { LoginService } from '../member/login/services.service';
import { AjaxSettingsService } from '../settings/ajax-settings.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css'],
	encapsulation: ViewEncapsulation.None,
	providers:[ LoginService, AjaxSettingsService ]
})
export class NavbarComponent implements OnInit {

	BTN : boolean;

	constructor(
		private service: LoginService,
		private location:Location,
		private router:Router
	) { 
		// this.service.authenticatedChange.subscribe((value) => {
		// 	this.BTN = value
		// });
	}

	// Permet de cacher la bar quand on doit se logger
	// Permet aussi d'afficher, ou de cacher le bouton [login] / [espace membre]
	public isHidden() {
		let list = ["/login","/register"], list2=["/member"],route = this.location.path();

		this.BTN = this.service.isLoggedIn || (list2.indexOf(route) > -1);

		return (list.indexOf(route) > -1);
	}
	public isLogged() {
		return this.service.isLoggedIn;
	}

	public logout(){
		this.service.logout(
			res => {
				console.log(res);
				if(res[0].success!==undefined){
					this.router.navigate(['/']);
					this.BTN = false;
				}
			})
	}
	
	ngOnInit() {
		this.service.isLogged(
			res=>{
				console.log(
					'[navbar] > ngOnInit > test logged ?'+
					'\n' + 
					this.service.isLoggedIn);
			})
	}
}
