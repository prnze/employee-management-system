import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-redirect',
  standalone: true,
  template: '<div class="p-5 text-center">Redirecting...</div>'
})
export class RedirectComponent implements OnInit {
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const redirectTo = this.route.snapshot.data['redirectTo'];
    if (redirectTo) {
      window.location.replace(redirectTo);
    }
  }
}
