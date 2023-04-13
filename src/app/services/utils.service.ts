import { Injectable, inject } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject } from 'rxjs';
import {
  EnumMessage,
  Message,
} from '../components/form-message/form-message.models';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  private readonly nzNotificationService = inject(NzNotificationService);
  private readonly translocoService = inject(TranslocoService);

  readonly eventNotifier$$ = new Subject<void>();
  readonly eventNotifier$ = this.eventNotifier$$.asObservable();

  universalPattern = '$2($3): $4  #$1';

  buildMessage(pattern: string, message: Message) {
    const replacements: { [key: string]: EnumMessage } = {
      $1: EnumMessage.Identifier,
      $2: EnumMessage.Type,
      $3: EnumMessage.Scope,
      $4: EnumMessage.Subject,
    };

    return pattern.replace(
      /\$(1|2|3|4)/g,
      (_, capture) => message[replacements[`$${capture}`]]
    );
  }

  showNotificationSuccess(message: string): void {
    this.nzNotificationService.success(
      '',
      this.translocoService.translate(message),
      {
        nzPlacement: 'top',
        nzDuration: 4000,
      }
    );
  }
}
