import { Routes } from '@angular/router';
import { ApitestComponent } from './test/apitest';
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './auth/auth.guard';
import { ProjectsListComponent } from './project/list.component';
import { CreateProjectComponent } from './project/create.component';
import { ProjectDetailComponent } from './project/detail.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, canActivate: [authGuard]},
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent},
    { path: 'test', component: ApitestComponent },
    {path: 'projects', canActivate: [authGuard], children: [{ path: '', component: ProjectsListComponent },{ path: 'create', component: CreateProjectComponent }, { path: ':id', component: ProjectDetailComponent }
    ]
  },
];
