import {test} from 'zora';
import square from './square';

test(`some test passing test`, t => {
    t.eq(square(2), 4, `2 * 2 = 4`);
});