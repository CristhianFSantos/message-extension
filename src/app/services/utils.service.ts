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

  readonly universalPattern = '$2($3): $4  #$1';

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

  showNotification(message: string, type: 'error' | 'success'): void {
    this.nzNotificationService[type](
      '',
      this.translocoService.translate(message),
      {
        nzPlacement: 'topRight',
        nzDuration: 3000,
      }
    );
  }

  extractWorkItemNumberFromAzureUrl = (url: string): number | null => {
    const match = url.match(/workitem=(\d+)/) ?? url.match(/\/edit\/(\d+)/);
    return match ? Number(match[1]) : null;
  };

  extractIssueNumberFromGitHubUrl = (url: string): number | null => {
    const match = url.match(/issues\/(\d+)/);
    return match ? Number(match[1]) : null;
  };
}
