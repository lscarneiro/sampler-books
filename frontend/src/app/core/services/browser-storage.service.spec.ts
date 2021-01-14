import { TestBed } from '@angular/core/testing';

import { BrowserStorageService } from './browser-storage.service';

describe('BrowserStorageService', () => {
  let service: BrowserStorageService;
  const DUMMY_KEY = 'dummyKey';
  const DUMMY_VALUE = 'some dummy value';
  const OTHER_DUMMY_KEY = 'otherDummyKey';
  const OTHER_DUMMY_VALUE = 'some other dummy value';

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrowserStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should storage an item', () => {
    service.setItem(DUMMY_KEY, DUMMY_VALUE);
    const storedValue = service.getItem(DUMMY_KEY);
    expect(storedValue).toBe(DUMMY_VALUE);
  });

  it('should clear all values stored', () => {
    service.setItem(DUMMY_KEY, DUMMY_VALUE);
    service.clear();
    const storedValue = service.getItem(DUMMY_KEY);
    expect(storedValue).toBeNull();
  });

  it('should remove a single item by key', () => {
    service.setItem(DUMMY_KEY, DUMMY_VALUE);
    service.setItem(OTHER_DUMMY_KEY, OTHER_DUMMY_VALUE);

    service.removeItem(DUMMY_KEY);

    const storedDummyValue = service.getItem(DUMMY_KEY);
    const storedOtherValue = service.getItem(OTHER_DUMMY_KEY);

    expect(storedDummyValue).toBeNull();
    expect(storedOtherValue).toBe(OTHER_DUMMY_VALUE);
  });
});
