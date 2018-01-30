import { Component, OnInit, ViewEncapsulation, HostListener, Output, EventEmitter } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
// Providers & service
import { LoginService } from './services.service';
import { AjaxSettingsService } from '../../settings/ajax-settings.service';
// Router pour la redirection après succès
import { Router } from '@angular/router';
// On va regarder si l'utilisateur voulait réserver en même temps
// Car l'url peut contenir une annonce
import { Location } from '@angular/common';




@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
	providers: [  LoginService , AjaxSettingsService],
	encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
	
	constructor(
		private service: LoginService,
		private router: Router,
		private location: Location
		) { }

	login: string;
	pass: string;
	ok : boolean = true;
	message: string ='';
	
	onSubmit(){
		this.service.login(this.login, this.pass,(result) => {

			console.log(result[0]['error']);
			console.log(result[0]['success']);

			if(result[0]['error']!==undefined){
				this.message = '';
				this.ok = false;
				this.message = result[0]['error'];
			}else if(result[0]['success']!==undefined){
				this.message ='';
				this.ok = true;
				console.log("this.service.isLoggedIn");
				console.log(this.service.isLoggedIn);
				console.log("before redirection");
				// On va voir si l'url contient une annonce
				this.checkUrl();
			}
		})
	}

	checkUrl(){
		let url = this.location.path().split('/');
	
		if(url.length >= 5){
			let annonce = url[2] + '/' + url[3] + '/' + url[4];
			this.router.navigate(['/annonce/'+annonce]);
		}else 
			this.router.navigate(['/member']);
	}

	ngOnInit() {

		if(this.service.isLoggedIn){
			this.router.navigate(['/member']);
		}
	}

}
