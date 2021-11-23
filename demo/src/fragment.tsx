import {render, h, Fragment, useState, useEffect} from '../../src/index'

function fk({i = 0}) {
	const [c, s] = useState(i);
	return h('button', {
		onClick() {
			s(c + 1);
		}
	}, c);
}

function test() {
	const [c, s] = useState(true);
	return h(Fragment, {}, h('button', {
		onClick() {
			s(!c);
		}
	}, 'change'), c ? h(fk) : 'none');
}

render(
	h(test),
	document.getElementById('app')
);