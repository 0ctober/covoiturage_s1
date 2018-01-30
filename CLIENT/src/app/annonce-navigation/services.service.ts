import { Injectable, Component,	OnInit,	ViewEncapsulation } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AjaxSettingsService } from '../settings/ajax-settings.service';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class ServicesService {
	// getAnnonces() : Observable<any> {
	// 	let observable : Observable<any> = this.http.get(this.actionUrl).map((res:Response)=> res.json());
	// 	return observable;
	// }

	constructor(private http: Http, private cfg : AjaxSettingsService){	}

	getAnnonce(callback){
		// let data_;

		// this.http.get(this.cfg.Server)
		// 	.map((res:Response) =>  res.json())
		// 	.subscribe(
		// 		res => callback(res),
		// 		error => console.log(error)
		// 	);
		// callback(JSON.stringify(data_));
		// return data_;
	}

	ngOnInit(): void {
		// let o  = this.getAnnonce();
	}
}
