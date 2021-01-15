import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  constructor() {}

  private loadingObservable = new Subject<boolean>();
  isLoading = false;

  OnLoadingEvent: Observable<boolean> = this.loadingObservable;

  PropagateLoadingState(isLoading: boolean): void {
    this.isLoading = isLoading;
    this.loadingObservable.next(isLoading);
  }
}
