import { Publisher, Subjects, ExpirationCompleteEvent } from '@mmb8npm/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}