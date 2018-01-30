import { Injectable } from '@angular/core';

@Injectable()
export class AjaxSettingsService {
	public Server = 'http://127.0.0.1:1333'	;
	public ApiUrl = 'api/';
	public ServerWithApiUrl = this.Server + this.ApiUrl;
	
	constructor() { }

}