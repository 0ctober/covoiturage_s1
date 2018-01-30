import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router, Routes, RouterModule } from '@angular/router';
import { LoginService } from '../../member/login/services.service';


@Component({
	selector: 'app-panel',
	templateUrl: './panel.component.html',
	styleUrls: ['./panel.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class PanelComponent implements OnInit {

	constructor(private logginService: LoginService) {

		this.logginService.isLogged(res=>{
			if(res[0].connected){
				// On enregistre le niveau de privilège : 0: Admin, 1: normal
				this.right  = res[0].right;
			}
		});
	}

	right : number = 1 ;

	ngOnInit() {

	}

}
