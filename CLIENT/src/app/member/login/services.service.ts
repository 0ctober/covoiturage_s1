import { Observable } from 'rxjs/Rx';
import { Injectable, Component,	OnInit,	ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AjaxSettingsService } from '../../settings/ajax-settings.service';
import 'rxjs/add/operator/map';
import 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import {Subject} from 'rxjs/Subject';

export interface myData {
	toto : string;
}

@Injectable()
export class LoginService {

	constructor(private http: Http,	private cfg : AjaxSettingsService){
		this.authenticatedChange.subscribe(value=> {this.isLoggedIn = value});

	}

	private _isLoggedIn: boolean = false;
	private _error: string = '';
	private _ok: boolean = true;
	private options = {withCredentials : true};
	private _user_right : number = -1;

	authenticatedChange: Subject<boolean> = new Subject<boolean>();

	get isLoggedIn(): boolean {	return this._isLoggedIn;}
	set isLoggedIn(newVal){ this._isLoggedIn = newVal;}
	get error(): string {	return this._error;}
	set error(newVal){ this._error = newVal;}
	get ok(): boolean {	return this._ok;}
	set ok(newVal){ this._ok = newVal;}
	get user_right(): number {	return this._user_right;}
	set user_right(newVal){ this._user_right = newVal;}

	isLoggedIn2():Observable<boolean> {
		let furl = this.cfg.Server + '/member/logged';
    	return this.http.get(furl, this.options)
		.map((res:Response) =>  res.json()[0]['connected']); // issue 1
	}

	// Appelé en soumission de formulaire
	login(usr, pwd, callback): void {
		let furl = this.cfg.Server + '/login/' + usr + '/' + pwd;

		this.http.get(furl, this.options)
		.map((res:Response) =>  res.json())
		.subscribe(
			res => {
				if(res[0]['error']!==undefined){
					this.error == res[0]['error'];
					this.isLoggedIn = false;
					console.log("[LoginService] > error");
				}else if(res[0]['success']!==undefined){
					this.error == '';
					this.isLoggedIn = true;
					console.log("[LoginService] > success");
				}
				console.log(this.isLoggedIn);
				this.authenticatedChange.next(this.isLoggedIn);
				callback(res);
			},
			error => callback([{'error':'cant check the server'}])
			);
		
	}

	// Appelé en soumission de formulaire
	logout(callback) : void {
		let furl = this.cfg.Server + '/logout';

		this.http.get(furl, this.options)
		.map((res:Response) =>  res.json())
		.subscribe(
			res => {
				if(res[0].success!==undefined){
					this.isLoggedIn = false;
					this.user_right = -1;
					this.authenticatedChange.next(this.isLoggedIn);
				}
				callback(res);
			},
			error => callback([{'error':'cant check the server'}])
			);
	}

	// Appelé par le composant principal lors du chargement d'Angular
	isLogged(callback) : void {
		let furl = this.cfg.Server + '/member/logged';

			this.http.get(furl, this.options)
			.map((res:Response)=> res.json())
			.subscribe(
				res => {
					if(res[0]['connected']){
						this.isLoggedIn = true;
						this.user_right = res[0].user_right;
					}
					else{
						this.isLoggedIn = false;
						this.user_right = -1;
					}
					this.authenticatedChange.next(this.isLoggedIn);
					callback(res)
				},
				error => callback([{'error':'cant check the server'}])
				)
	}

	// Appelé en soumission de formulaire
	register(form, callback){
		let furl = this.cfg.Server + '/register/' + JSON.stringify(form);

		this.http.get(furl, this.options)
		.map((res:Response) =>  res.json())
		.subscribe(
			res => {
				
				callback(res);
			}
			,
			error => callback([{'error':'cant check the server'}])
			);		
		console.log('[form] > Register ');
	}

	ngOnInit(): void {
	}
}