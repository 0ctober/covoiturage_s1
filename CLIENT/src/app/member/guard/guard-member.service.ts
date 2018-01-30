import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { LoginService } from '../login/services.service';
import { Observable } from 'rxjs/Rx';



@Injectable()
export class GuardMemberService {

	constructor(public service: LoginService, public router: Router) { }


	canActivate() {
		console.log("[guard-member] > this.service.isLoggedIn");

        return this.service.isLoggedIn2().map(e => {
            if (e) 
                return true;
            this.router.navigate(['/login']);
            return false;
        });

	}
}

