import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should propagate server validation error via OnServerError', (done) => {
    service.OnLoadingEvent.subscribe((result) => {
      expect(result).toBeTruthy();

      done();
    });

    service.PropagateLoadingState(true);
  });
});
