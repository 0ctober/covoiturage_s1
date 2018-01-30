import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
// Providers & service
import { LoginService } from '../login/services.service';
import { AjaxSettingsService } from '../../settings/ajax-settings.service';
// Router pour la redirection après succès
import { Router } from '@angular/router';
// Test pour la déconnection
// import  { LoginComponent } from '../login/login.component';

@Component({
	selector: 'app-logout',
	templateUrl: './logout.component.html',
	styleUrls: ['./logout.component.css'],
	providers: [  LoginService , AjaxSettingsService],
	encapsulation: ViewEncapsulation.None
})
export class LogoutComponent implements OnInit {
	
	constructor(private service: LoginService, private router: Router) { }
	
	private isLoggedIn: boolean = false;
	private error: string = '';
	private ok: boolean = true;

	logout() {

		console.log('-------------------');
		console.log('[logout] > logout');

		// this.service.logout((result) => {
		// 	console.log('result : ' + result);
		// 	this.service.isLoggedIn = false;
		// 	return result[0].success === true;
		// })
		return this.service.isLoggedIn;
	}

	ngOnInit() {
	}

}
