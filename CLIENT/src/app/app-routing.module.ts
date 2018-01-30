// Import des modules
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import des composants
// import { HomeContentComponent } from './home-content/home-content.component';
import { LoginComponent } from './member/login/login.component';
import { RegisterComponent } from './member/register/register.component';
import { LogoutComponent } from './member/logout/logout.component';
import { PanelComponent } from './member/panel/panel.component';
import { DisplayResultComponent } from './annonce-navigation/display-result/display-result.component';
import { SearchAnnonceComponent } from './annonce-navigation/search-annonce/search-annonce.component';
import { CatchAnnonceComponent } from './annonce-navigation/catch-annonce/catch-annonce.component';

// Import des Guards
import { GuardMemberService } from './member/guard/guard-member.service';
import { GuardAdminService } from './member/guard/guard-admin.service';
import { AlreadyLoggedService } from './member/guard/already-logged.service';

// Module enfant
import { MemberRoutingModule } from './member/member-routing.module';
import { MemberModule } from './member/member.module';

const routes: Routes = [
	// Accueil
	{
		path : '',
		component : SearchAnnonceComponent
	},
	// Affichage d'une annonce
	{
		path: 'annonce/:id/:depart/:arrivee',
		component: CatchAnnonceComponent
	},
		{
		path: 'annonce',
		component: CatchAnnonceComponent
	},
	// Recherche d'annonce
	{
		path: 'search/:depart/:arrivee/:datetime/:order',
		component: DisplayResultComponent
	},
	{
		path: 'search',
		component: DisplayResultComponent
	},
	// Connexion avec annonce réservable après soumission
	{
		path : 'login/:id/:a/:b',
		component : LoginComponent,
		canActivate : [AlreadyLoggedService]
	},
	// Connexion
	{
		path : 'login',
		component : LoginComponent,
		canActivate : [AlreadyLoggedService]
	},
	// Déconnexion TODELETE
	{
		path : 'logout',
		component : LogoutComponent,
		canActivate : [GuardMemberService]
	},
	// Se connecter
	{
		path : 'register',
		component : RegisterComponent,
		canActivate : [AlreadyLoggedService]
	},
	// Pannel membre
	{
		path : 'member',
		// component : PanelComponent,
		canActivate : [GuardMemberService], 
		loadChildren: 'app/member/member.module#MemberModule',
		data: { preloaded:true}
	},
	// Autres URL
	{
		path:'**',
		component:SearchAnnonceComponent
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
