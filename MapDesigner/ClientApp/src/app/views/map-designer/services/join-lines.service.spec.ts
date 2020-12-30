import { TestBed } from '@angular/core/testing';

import { JoinLinesService } from './join-lines.service';

describe('JoinLinesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JoinLinesService = TestBed.get(JoinLinesService);
    expect(service).toBeTruthy();
  });
});
