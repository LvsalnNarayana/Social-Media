import { TestBed } from '@angular/core/testing';

import { StateVariablesService } from './state-variables.service';

describe('StateVariablesService', () => {
  let service: StateVariablesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateVariablesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
