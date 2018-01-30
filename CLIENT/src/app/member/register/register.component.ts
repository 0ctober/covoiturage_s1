import { Component,	OnInit, Pipe, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { LoginService } from '../login/services.service';
// Router pour la redirection après succès
import { Router } from '@angular/router';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class RegisterComponent implements OnInit {

	constructor(private router: Router, private service:LoginService) { }
	// Gestion du message de retour du srver
	public ok: boolean = true;
	public message: string="";

	// Gestion du two-way data-binding
	login : string;
	pass1 : string;
	pass2 : string;
	nom : string;
	prenom : string;
	dd : number;
	mm : number;
	yyyy : number;
	adresse : string;
	phone : string;

	// Formulaire : Contrôleur
	myform: FormGroup;
	firstName: FormControl;
	name: FormControl;
	email: FormControl;
	password1: FormControl;
	password2: FormControl;
	day : FormControl;
	month : FormControl;
	year : FormControl;
	adress : FormControl;
	numberP : FormControl;

	// Appel de la <soumission>
	onSubmit(){
		console.log('error 5');

		let form = {
			login : this.login,
			pass1 : this.pass1,
			pass2 : this.pass2,
			nom : this.nom,
			prenom : this.prenom,
			dd : this.dd,
			mm : this.mm,
			yyyy : this.yyyy,
			adresse : this.adresse,
			phone : this.phone
		};

		// Check si le formulaire est conform
		if(this.myform.valid && this.equalsPasswords()){
			// Appel du service + XHR
			this.service.register(form,(result) => {
				// Erreur et succès de la requête
				console.log(result);
				if(result[0].error !== undefined){
					this.message = result[0].error ;
					this.ok = false;
				}else if(result[0].success !== undefined){
					this.ok = true;
					this.message = result[0].error ;
					this.service.isLoggedIn=true;
					this.service.user_right=result[0].right;
					this.router.navigate(['/member']);
					// L'user est redirigé dans son espace membre
				}
			})
		}
	}

	// Règles du contrôleur : pattern, required, minLength.
	createFormControls() {
		console.log('error 4 ');

		this.firstName = new FormControl('',[
			Validators.required,
			Validators.pattern("^[A-Za-z]+((\s)?((\'|\-|\.)?([A-Za-z])+))*$"),
			Validators.minLength(2)
			]);
		this.name = new FormControl('',[
			Validators.required,
			Validators.pattern("^[A-Za-z]+((\s)?((\'|\-|\.)?([A-Za-z])+))*$"),
			Validators.minLength(2)
			]);
		this.email = new FormControl('', [
			Validators.required,
			Validators.pattern("[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}")
			]);
		this.password1 = new FormControl('', [
			Validators.required,
			Validators.minLength(8)
			]);
		this.password2 = new FormControl('', [
			Validators.required,
			Validators.minLength(8)
			]);
		this.day = new FormControl('',[
			Validators.required,
			Validators.pattern("(0[1-9]|1[0-9]|2[0-9]|3[01])"),
			]);
		this.month = new FormControl('',[
			Validators.required,
			Validators.pattern("(0[1-9]|1[012])"),
			Validators.maxLength(2),
			Validators.minLength(2)
			]);
		this.year = new FormControl('',[
			Validators.required,
			Validators.pattern("[0-9]{4}"),
			Validators.minLength(4),
			Validators.maxLength(4)
			]);
		this.adress = new FormControl('',[
			Validators.required,
			Validators.minLength(10)
			]);
		this.numberP = new FormControl('',[
			Validators.required,
			Validators.pattern("[0-9]{10}"),
			Validators.minLength(10),
			Validators.maxLength(10)
			]);
	}

	// Comparaison du mot de passe et sa confirmation
	equalsPasswords(){
		console.log('error 1 ');
		return this.pass1 === this.pass2;
	}

	// structure du formulaire
	createForm() {
		console.log('error 2 ');
		this.myform = new FormGroup({
			email: this.email,
			password1: this.password1,
			password2: this.password2,
			name: this.name,
			firstName: this.firstName,
			day: this.day,
			month: this.month,
			year: this.year,
			adress: this.adress,
			numberP: this.numberP
		});
	}

	// Initialisation des composants
	ngOnInit() {
		console.log('error 3 ');

		if(this.service.isLoggedIn){
			this.router.navigate(['/member']);
		}
		this.createFormControls();
		this.createForm();
	}

}
