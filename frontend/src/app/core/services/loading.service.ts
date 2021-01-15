import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  constructor() {}

  private loadingObservable = new Subject<boolean>();

  OnLoadingEvent: Observable<boolean> = this.loadingObservable;

  PropagateLoadingState(isLoading: boolean): void {
    this.loadingObservable.next(isLoading);
  }
}
