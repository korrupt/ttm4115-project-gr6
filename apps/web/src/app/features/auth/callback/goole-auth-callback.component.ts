import { HttpBackend, HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { WebAuthService } from "../../../services/auth.service";


@Component({
  templateUrl: './google-auth-callback.component.html',
  styles: [],
  standalone: true,
  imports: [RouterModule, MatProgressSpinnerModule]
})
export class GoogleAuthCallbackComponent implements OnInit {
  constructor(readonly route: ActivatedRoute, private router: Router, private httpBackend: HttpBackend, private auth: WebAuthService){}

  error?: string;
  loading = true;

  http = new HttpClient(this.httpBackend);

  ngOnInit(): void {
    this.http.get<{ access_token: string }>('/api/auth/google/callback', {
      params: this.route.snapshot.queryParams,
    }).subscribe({
      next: (res) => {
        this.auth.login(res.access_token);
        this.router.navigate(["/"]);
      },
      error: (e) => {
        this.error = e.statusText || "An error occured";
        this.loading = false;
      },
      complete: () => { this.loading = false }
    });
  }
}
