import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import des composants
import { CreateAnnonceComponent } from './create-annonce/create-annonce.component'
import { TrajetTypeComponent } from './trajet-type/trajet-type.component'

// Import des modules
import { PanelComponent } from './panel/panel.component';

const routes: Routes = [
	{
		path : '',
		component : PanelComponent,
		// canActivate : [GuardMemberService], 
		children: [
            { path: 'annonce/edit', component: CreateAnnonceComponent},
            { path: 'annonce/historique', component: CreateAnnonceComponent},
            { path: 'admin/trajettype', component: TrajetTypeComponent},
        ]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule { }
