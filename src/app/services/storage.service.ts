import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  async post(userConfig: UserConfig): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage?.sync?.set({ userConfig }, () => resolve());
    });
  }

  async getUserConfig(): Promise<UserConfig> {
    return new Promise((resolve) => {
      chrome.storage?.sync?.get?.(['userConfig'], (response) =>
        resolve(response['userConfig'] as UserConfig)
      );
    });
  }
}

export interface UserConfig {
  alwaysCustomFormat: boolean;
  allFieldsRequired: boolean;
  autoSave: boolean;
  pattern: string;
}
