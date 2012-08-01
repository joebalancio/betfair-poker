define(["jade"], function() {
function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var __jade = [{ lineno: 1, filename: undefined }];
try {
var buf = [];
with (locals || {}) {
var interp;
__jade.unshift({ lineno: 1, filename: __jade[0].filename });
__jade.unshift({ lineno: 2, filename: __jade[0].filename });
buf.push('<p>');
__jade.unshift({ lineno: undefined, filename: __jade[0].filename });
__jade.unshift({ lineno: 2, filename: __jade[0].filename });
buf.push('<small class="timestamp">');
__jade.unshift({ lineno: undefined, filename: __jade[0].filename });
__jade.unshift({ lineno: 2, filename: __jade[0].filename });
buf.push('' + escape((interp = timestamp) == null ? '' : interp) + '');
__jade.shift();
__jade.shift();
buf.push('</small>');
__jade.shift();
__jade.unshift({ lineno: 3, filename: __jade[0].filename });
switch (name){
case 'sentinel':
__jade.unshift({ lineno: 5, filename: __jade[0].filename });
__jade.unshift({ lineno: 5, filename: __jade[0].filename });
buf.push('<b class="label label-important">');
__jade.unshift({ lineno: undefined, filename: __jade[0].filename });
__jade.unshift({ lineno: 5, filename: __jade[0].filename });
buf.push('' + escape((interp = name) == null ? '' : interp) + '');
__jade.shift();
__jade.shift();
buf.push('</b>');
__jade.shift();
__jade.shift();
  break;
default:
__jade.unshift({ lineno: 7, filename: __jade[0].filename });
__jade.unshift({ lineno: 7, filename: __jade[0].filename });
buf.push('<b>');
__jade.unshift({ lineno: undefined, filename: __jade[0].filename });
__jade.unshift({ lineno: 7, filename: __jade[0].filename });
buf.push('' + escape((interp = name) == null ? '' : interp) + ':');
__jade.shift();
__jade.shift();
buf.push('</b>');
__jade.shift();
__jade.shift();
  break;
__jade.shift();
__jade.shift();
}
__jade.shift();
__jade.unshift({ lineno: 8, filename: __jade[0].filename });
buf.push('&nbsp;');
__jade.shift();
__jade.unshift({ lineno: 9, filename: __jade[0].filename });
buf.push('<span>');
__jade.unshift({ lineno: undefined, filename: __jade[0].filename });
__jade.unshift({ lineno: 9, filename: __jade[0].filename });
buf.push('' + escape((interp = message) == null ? '' : interp) + '');
__jade.shift();
__jade.shift();
buf.push('</span>');
__jade.shift();
__jade.shift();
buf.push('</p>');
__jade.shift();
__jade.shift();
}
return buf.join("");
} catch (err) {
  rethrow(err, __jade[0].filename, __jade[0].lineno);
}
}
return anonymous;
});