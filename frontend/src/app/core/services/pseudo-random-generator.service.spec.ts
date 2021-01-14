import { TestBed } from '@angular/core/testing';

import { PseudoRandomGeneratorService } from './pseudo-random-generator.service';

describe('PseudoRandonGeneratorService', () => {
  let service: PseudoRandomGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PseudoRandomGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should generate at least 1000 different strings', () => {
    const generatedStrings = [];
    for (let i = 0; i < 1000; i++) {
      generatedStrings.push(service.generate());
    }
    const distinctStrings = [...new Set(generatedStrings)];
    expect(distinctStrings.length).toEqual(generatedStrings.length);
  });
});
