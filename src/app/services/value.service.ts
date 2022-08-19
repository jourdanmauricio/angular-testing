import { Injectable } from '@angular/core';
import { mockObservable } from 'src/testing';

@Injectable({
  providedIn: 'root',
})
export class ValueService {
  private value = 'my value';

  constructor() {}

  getValue() {
    // code
    // 10
    // google-maps key
    return this.value;
  }

  setValue(value: string) {
    this.value = value;
  }

  getPromiseValue() {
    return Promise.resolve('promise value');
  }

  getObservableValue() {
    return mockObservable('observable value');
  }
}
