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

  it('should propagate loading state true', (done) => {
    service.OnLoadingEvent.subscribe((result) => {
      expect(result).toBeTrue();
      expect(service.isLoading).toBeTrue();

      done();
    });

    service.PropagateLoadingState(true);
  });

  it('should propagate loading state false', (done) => {
    service.OnLoadingEvent.subscribe((result) => {
      expect(result).toBeFalse();
      expect(service.isLoading).toBeFalse();

      done();
    });

    service.PropagateLoadingState(false);
  });
});
