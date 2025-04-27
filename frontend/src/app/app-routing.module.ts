import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesComponent } from './sales/sales.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { AnalyticsComponent } from './analytics/analytics.component';

const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "sales", component: SalesComponent, canActivate: [AuthGuard]},
  {path:"login",component:LoginComponent},
  {path:"customer-view",component:CustomerViewComponent},
  {path:"analytics",component:AnalyticsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
