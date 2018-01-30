import { Component, OnInit } from '@angular/core';
import { LoginService } from './member/login/services.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	private userIsLogged : boolean = false;

	constructor(private logged: LoginService){}

	ngOnInit(): void {

		this.logged.isLogged(
			res => {
				console.log('[ngOnInitInit] > AppComponent');
				console.log(res);
				console.log('[ ] connected : ' + res[0]['connected']);
				console.log('[ ] error : ' + res[0]['error']);
				console.log('-----------------------------');
				this.userIsLogged = true;
			}
		)

	}

}