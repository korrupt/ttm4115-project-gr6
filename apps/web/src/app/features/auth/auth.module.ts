import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthComponent } from "./auth.component";
import { ReactiveFormsModule } from "@angular/forms";
import { GoogleAuthCallbackComponent } from "./callback/goole-auth-callback.component";

const routes: Routes = [
  {
    path: '',
    component: AuthComponent
  },
  {
    path: 'google',
    component: GoogleAuthCallbackComponent
  }
]


@NgModule({
  imports: [
    AuthComponent,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
})
export class AuthFeatureModule {}
