import { strict as assert } from 'assert';
import {
  WarningInitConstructorMessage,
  WarningInitFunctionMessage,
} from './errorMessages';

export function testWarningMessages() {
  assert.equal(
    WarningInitConstructorMessage(),
    'You must construct a instance using init function'
  );
  assert.equal(
    WarningInitFunctionMessage('test'),
    `You can't directly call test instead of init function`
  );
}
