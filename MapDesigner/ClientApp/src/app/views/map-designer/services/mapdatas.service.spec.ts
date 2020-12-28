import { TestBed } from '@angular/core/testing';

import { MapdatasService } from './mapdatas.service';

describe('MapdatasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapdatasService = TestBed.get(MapdatasService);
    expect(service).toBeTruthy();
  });
});
