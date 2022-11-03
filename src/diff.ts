const diff = function (opts) {
  var actions = [],
    aIdx = {},
    bIdx = {},
    a = opts.old,
    b = opts.cur,
    key = opts.extractKey,
    i,
    j;
  for (i = 0; i < a.length; i++) {
    aIdx[key(a[i])] = i;
  }
  for (i = 0; i < b.length; i++) {
    bIdx[key(b[i])] = i;
  }
  for (i = j = 0; i !== a.length || j !== b.length; ) {
    var aElm = a[i],
      bElm = b[j];
    if (aElm === null) {
      i++;
    } else if (b.length <= j) {
      opts.remove(i);
      i++;
    } else if (a.length <= i) {
      opts.add(bElm, i);
      j++;
    } else if (key(aElm) === key(bElm)) {
      i++;
      j++;
    } else {
      var curElmInNew = bIdx[key(aElm)];
      var wantedElmInOld = aIdx[key(bElm)];
      if (curElmInNew === undefined) {
        opts.remove(i);
        i++;
      } else if (wantedElmInOld === undefined) {
        opts.add(bElm, i);
        j++;
      } else {
        opts.move(wantedElmInOld, i);
        a[wantedElmInOld] = null;
        j++;
      }
    }
  }
  return actions;
};

export const diff1 = function (a, b, opts) {
  var opts = opts || {};
  var actions = [];
  var extr = function (v) {
    return v;
  };
  var move = function (from, to) {
    actions.push({ type: 'move', elm: a[from], before: a[to] });
  };
  var add = function (elm, i) {
    actions.push({ type: 'add', elm: elm, before: a[i] });
  };
  var remove = function (i) {
    actions.push({ type: 'remove', elm: a[i], before: a[i + 1] });
  };
  diff({
    old: a,
    cur: b,
    extractKey: opts.extr || extr,
    add: add,
    move: move,
    remove: remove,
  });
  return actions;
};
