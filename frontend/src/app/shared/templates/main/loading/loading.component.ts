import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/core/services';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  constructor(private loadingSevice: LoadingService) {}

  isLoading = false;

  ngOnInit(): void {
    this.isLoading = this.loadingSevice.isLoading;
    this.loadingSevice.OnLoadingEvent.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }
}
