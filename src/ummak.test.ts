import { strict as assert } from 'assert';
import { Ummak, WarningInitConstructorMessage } from '.';

// Error you construct a instance using init function
export function testUmmakConstructorDirectly() {
  assert.throws(() => {
    new Ummak('file.json', Symbol('UMMAK'));
  }, new Error(WarningInitConstructorMessage()));
}

// Successful you use init function
export function testUmmakInit() {
  const ummak = Ummak.init();
  assert.equal(ummak instanceof Ummak, true);
}
