import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PseudoRandomGeneratorService {
  constructor() {}

  generate(): string {
    return Math.random()
      .toString(36)
      .replace(/[^a-z0-9]+/g, '');
  }
}
