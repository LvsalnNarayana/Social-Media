import { TestBed } from '@angular/core/testing';

import { PostHandlerService } from './post-handler.service';

describe('PostHandlerService', () => {
  let service: PostHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
