import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { LoginService } from '../login/services.service';

@Injectable()
export class GuardAdminService {

	constructor(public service: LoginService, public router: Router) { }

	CanActivate(): boolean {
		if(this.service.isLoggedIn && this.service.user_right == 0)
			return true;
		this.router.navigate(['/login']);
		return false;
	}

}
