import { TestBed } from '@angular/core/testing';

import { MapSchemaService } from './map-schema.service';

describe('MapSchemaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapSchemaService = TestBed.get(MapSchemaService);
    expect(service).toBeTruthy();
  });
});
