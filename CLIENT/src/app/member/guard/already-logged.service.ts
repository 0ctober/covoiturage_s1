import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { LoginService } from '../login/services.service';
import { Observable } from 'rxjs/Rx';



@Injectable()
export class AlreadyLoggedService {

	constructor(public service: LoginService, public router: Router) { }

	canActivate() {
		console.log("[guard-already-logged]");
        return this.service.isLoggedIn2().map(e => {
            if (!e) 
                return true;
            this.router.navigate(['/member']);
            return false;
        }).catch(() => {
            this.router.navigate(['/member']);
            return Observable.of(false);
        });

	}
}

