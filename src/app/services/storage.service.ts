import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  async postUserConfig(userConfig: UserConfig): Promise<void> {
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

  async postLastMessage(message: string): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage?.sync?.set({ message }, () => resolve());
    });
  }

  async getLastMessage(): Promise<string> {
    return new Promise((resolve) => {
      chrome.storage?.sync?.get?.(['message'], (response) =>
        resolve(response['message'] as string)
      );
    });
  }
}

export interface UserConfig {
  alwaysCustomFormat: boolean;
  allFieldsRequired: boolean;
  saveLastMessage: boolean;
  pattern: string;
}
