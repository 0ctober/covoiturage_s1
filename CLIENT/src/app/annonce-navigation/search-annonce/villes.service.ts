import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AjaxSettingsService } from '../../settings/ajax-settings.service';

@Injectable()
export class VillesService {

	constructor(private http: Http, private cfg : AjaxSettingsService){	}
	
	private options = {withCredentials : true};

	getVilles(prefix, callback){

		let furl = this.cfg.Server + '/villes/input/' + prefix;
		console.log('vILLEsERVICE > prefix');
		console.log(prefix);

		this.http.get(furl, this.options)
		.map((res:Response) =>  res.json().villes)
		.subscribe(
			res => callback(res),
			error => callback([{'error':'cant check the server'}])
			);
		

	}

}
