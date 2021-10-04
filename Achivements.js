var Achivements;
(function (Achivements) {
    'use strict';
    var WORD_LENGTH = 32;
    var WORD_LOG = 5;
    function popCount(v) {
        v -= ((v >>> 1) & 0x55555555);
        v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);
        return (((v + (v >>> 4) & 0xF0F0F0F) * 0x1010101) >>> 24);
    }
    function divide(arr, B) {
        var r = 0;
        for (var i = 0; i < arr.length; i++) {
            r *= 2;
            var d = (arr[i] + r) / B | 0;
            r = (arr[i] + r) % B;
            arr[i] = d;
        }
        return r;
    }
    function parse(P, val) {
        if (val == null) {
            P['data'] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            P['_'] = 0;
            return;
        }
        if (val instanceof BitSet) {
            P['data'] = val['data'];
            P['_'] = val['_'];
            return;
        }
        switch (typeof val) {
            case 'number':
                P['data'] = [val | 0];
                P['_'] = 0;
                break;
            case 'string':
                var base = 2;
                var len = WORD_LENGTH;
                if (val.indexOf('0b') === 0) {
                    val = val.substr(2);
                }
                else if (val.indexOf('0x') === 0) {
                    val = val.substr(2);
                    base = 16;
                    len = 8;
                }
                P['data'] = [];
                P['_'] = 0;
                var a = val.length - len;
                var b = val.length;
                do {
                    var num = parseInt(val.slice(a > 0 ? a : 0, b), base);
                    if (isNaN(num)) {
                        throw SyntaxError('Invalid param');
                    }
                    P['data'].push(num | 0);
                    if (a <= 0)
                        break;
                    a -= len;
                    b -= len;
                } while (1);
                break;
            default:
                P['data'] = [0];
                var data = P['data'];
                if (val instanceof Array) {
                    for (var i = val.length - 1; i >= 0; i--) {
                        var ndx = val[i];
                        if (ndx === Infinity) {
                            P['_'] = -1;
                        }
                        else {
                            scale(P, ndx);
                            data[ndx >>> WORD_LOG] |= 1 << ndx;
                        }
                    }
                    break;
                }
                if (Uint8Array && val instanceof Uint8Array) {
                    var bits = 8;
                    scale(P, val.length * bits);
                    for (var i = 0; i < val.length; i++) {
                        var n = val[i];
                        for (var j = 0; j < bits; j++) {
                            var k = i * bits + j;
                            data[k >>> WORD_LOG] |= (n >> j & 1) << k;
                        }
                    }
                    break;
                }
                throw SyntaxError('Invalid param');
        }
    }
    function BitSet(param) {
        if (!(this instanceof BitSet)) {
            return new BitSet(param);
        }
        parse(this, param);
        this['data'] = this['data'].slice();
    }
    function scale(dst, ndx) {
        var l = ndx >>> WORD_LOG;
        var d = dst['data'];
        var v = dst['_'];
        for (var i = d.length; l >= i; l--) {
            d.push(v);
        }
    }
    var P = {
        'data': [],
        '_': 0
    };
    BitSet.prototype = {
        'data': [],
        '_': 0,
        'set': function (ndx, value) {
            ndx |= 0;
            scale(this, ndx);
            if (value === undefined || value) {
                this['data'][ndx >>> WORD_LOG] |= (1 << ndx);
            }
            else {
                this['data'][ndx >>> WORD_LOG] &= ~(1 << ndx);
            }
            return this;
        },
        'get': function (ndx) {
            ndx |= 0;
            var d = this['data'];
            var n = ndx >>> WORD_LOG;
            if (n >= d.length) {
                return this['_'] & 1;
            }
            return (d[n] >>> ndx) & 1;
        },
        'not': function () {
            var t = this['clone']();
            var d = t['data'];
            for (var i = 0; i < d.length; i++) {
                d[i] = ~d[i];
            }
            t['_'] = ~t['_'];
            return t;
        },
        'and': function (value) {
            parse(P, value);
            var T = this['clone']();
            var t = T['data'];
            var p = P['data'];
            var pl = p.length;
            var p_ = P['_'];
            var t_ = T['_'];
            if (t_ !== 0) {
                scale(T, pl * WORD_LENGTH - 1);
            }
            var tl = t.length;
            var l = Math.min(pl, tl);
            var i = 0;
            for (; i < l; i++) {
                t[i] &= p[i];
            }
            for (; i < tl; i++) {
                t[i] &= p_;
            }
            T['_'] &= p_;
            return T;
        },
        'or': function (val) {
            parse(P, val);
            var t = this['clone']();
            var d = t['data'];
            var p = P['data'];
            var pl = p.length - 1;
            var tl = d.length - 1;
            var minLength = Math.min(tl, pl);
            for (var i = pl; i > minLength; i--) {
                d[i] = p[i];
            }
            for (; i >= 0; i--) {
                d[i] |= p[i];
            }
            t['_'] |= P['_'];
            return t;
        },
        'xor': function (val) {
            parse(P, val);
            var t = this['clone']();
            var d = t['data'];
            var p = P['data'];
            var t_ = t['_'];
            var p_ = P['_'];
            var i = 0;
            var tl = d.length - 1;
            var pl = p.length - 1;
            for (i = tl; i > pl; i--) {
                d[i] ^= p_;
            }
            for (i = pl; i > tl; i--) {
                d[i] = t_ ^ p[i];
            }
            for (; i >= 0; i--) {
                d[i] ^= p[i];
            }
            t['_'] ^= p_;
            return t;
        },
        'andNot': function (val) {
            return this['and'](new BitSet(val)['flip']());
        },
        'flip': function (from, to) {
            if (from === undefined) {
                var d = this['data'];
                for (var i = 0; i < d.length; i++) {
                    d[i] = ~d[i];
                }
                this['_'] = ~this['_'];
            }
            else if (to === undefined) {
                scale(this, from);
                this['data'][from >>> WORD_LOG] ^= (1 << from);
            }
            else if (0 <= from && from <= to) {
                scale(this, to);
                for (var i = from; i <= to; i++) {
                    this['data'][i >>> WORD_LOG] ^= (1 << i);
                }
            }
            return this;
        },
        'clear': function (from, to) {
            var data = this['data'];
            if (from === undefined) {
                for (var i = data.length - 1; i >= 0; i--) {
                    data[i] = 0;
                }
                this['_'] = 0;
            }
            else if (to === undefined) {
                from |= 0;
                scale(this, from);
                data[from >>> WORD_LOG] &= ~(1 << from);
            }
            else if (from <= to) {
                scale(this, to);
                for (var i = from; i <= to; i++) {
                    data[i >>> WORD_LOG] &= ~(1 << i);
                }
            }
            return this;
        },
        'slice': function (from, to) {
            if (from === undefined) {
                return this['clone']();
            }
            else if (to === undefined) {
                to = this['data'].length * WORD_LENGTH;
                var im = Object.create(BitSet.prototype);
                im['_'] = this['_'];
                im['data'] = [0];
                for (var i = from; i <= to; i++) {
                    im['set'](i - from, this['get'](i));
                }
                return im;
            }
            else if (from <= to && 0 <= from) {
                var im = Object.create(BitSet.prototype);
                im['data'] = [0];
                for (var i = from; i <= to; i++) {
                    im['set'](i - from, this['get'](i));
                }
                return im;
            }
            return null;
        },
        'setRange': function (from, to, value) {
            for (var i = from; i <= to; i++) {
                this['set'](i, value);
            }
            return this;
        },
        'clone': function () {
            var im = Object.create(BitSet.prototype);
            im['data'] = this['data'].slice();
            im['_'] = this['_'];
            return im;
        },
        'toArray': Math['clz32'] ?
            function () {
                var ret = [];
                var data = this['data'];
                for (var i = data.length - 1; i >= 0; i--) {
                    var num = data[i];
                    while (num !== 0) {
                        var t = 31 - Math['clz32'](num);
                        num ^= 1 << t;
                        ret.unshift((i * WORD_LENGTH) + t);
                    }
                }
                if (this['_'] !== 0)
                    ret.push(Infinity);
                return ret;
            } :
            function () {
                var ret = [];
                var data = this['data'];
                for (var i = 0; i < data.length; i++) {
                    var num = data[i];
                    while (num !== 0) {
                        var t = num & -num;
                        num ^= t;
                        ret.push((i * WORD_LENGTH) + popCount(t - 1));
                    }
                }
                if (this['_'] !== 0)
                    ret.push(Infinity);
                return ret;
            },
        'toString': function (base) {
            var data = this['data'];
            if (!base)
                base = 2;
            if ((base & (base - 1)) === 0 && base < 36) {
                var ret = '';
                var len = 2 + Math.log(4294967295) / Math.log(base) | 0;
                for (var i = data.length - 1; i >= 0; i--) {
                    var cur = data[i];
                    if (cur < 0)
                        cur += 4294967296;
                    var tmp = cur.toString(base);
                    if (ret !== '') {
                        ret += '0'.repeat(len - tmp.length - 1);
                    }
                    ret += tmp;
                }
                if (this['_'] === 0) {
                    ret = ret.replace(/^0+/, '');
                    if (ret === '')
                        ret = '0';
                    return ret;
                }
                else {
                    ret = '1111' + ret;
                    return ret.replace(/^1+/, '...1111');
                }
            }
            else {
                if ((2 > base || base > 36))
                    throw SyntaxError('Invalid base');
                var res;
                var arr = [];
                for (var i = data.length; i--;) {
                    for (var j = WORD_LENGTH; j--;) {
                        arr.push(data[i] >>> j & 1);
                    }
                }
                do {
                    res.unshift(divide(arr, base).toString(base));
                } while (!arr.every(function (x) {
                    return x === 0;
                }));
                return res.join('');
            }
        },
        'isEmpty': function () {
            if (this['_'] !== 0)
                return false;
            var d = this['data'];
            for (var i = d.length - 1; i >= 0; i--) {
                if (d[i] !== 0)
                    return false;
            }
            return true;
        },
        'cardinality': function () {
            if (this['_'] !== 0) {
                return Infinity;
            }
            var s = 0;
            var d = this['data'];
            for (var i = 0; i < d.length; i++) {
                var n = d[i];
                if (n !== 0)
                    s += popCount(n);
            }
            return s;
        },
        'msb': Math['clz32'] ?
            function () {
                if (this['_'] !== 0) {
                    return Infinity;
                }
                var data = this['data'];
                for (var i = data.length; i-- > 0;) {
                    var c = Math['clz32'](data[i]);
                    if (c !== WORD_LENGTH) {
                        return (i * WORD_LENGTH) + WORD_LENGTH - 1 - c;
                    }
                }
                return Infinity;
            } :
            function () {
                if (this['_'] !== 0) {
                    return Infinity;
                }
                var data = this['data'];
                for (var i = data.length; i-- > 0;) {
                    var v = data[i];
                    var c = 0;
                    if (v) {
                        for (; (v >>>= 1) > 0; c++) {
                        }
                        return (i * WORD_LENGTH) + c;
                    }
                }
                return Infinity;
            },
        'ntz': function () {
            var data = this['data'];
            for (var j = 0; j < data.length; j++) {
                var v = data[j];
                if (v !== 0) {
                    v = (v ^ (v - 1)) >>> 1;
                    return (j * WORD_LENGTH) + popCount(v);
                }
            }
            return Infinity;
        },
        'lsb': function () {
            var data = this['data'];
            for (var i = 0; i < data.length; i++) {
                var v = data[i];
                var c = 0;
                if (v) {
                    var bit = (v & -v);
                    for (; (bit >>>= 1); c++) {
                    }
                    return WORD_LENGTH * i + c;
                }
            }
            return this['_'] & 1;
        },
        'equals': function (val) {
            parse(P, val);
            var t = this['data'];
            var p = P['data'];
            var t_ = this['_'];
            var p_ = P['_'];
            var tl = t.length - 1;
            var pl = p.length - 1;
            if (p_ !== t_) {
                return false;
            }
            var minLength = tl < pl ? tl : pl;
            var i = 0;
            for (; i <= minLength; i++) {
                if (t[i] !== p[i])
                    return false;
            }
            for (i = tl; i > pl; i--) {
                if (t[i] !== p_)
                    return false;
            }
            for (i = pl; i > tl; i--) {
                if (p[i] !== t_)
                    return false;
            }
            return true;
        },
        [Symbol.iterator]: function () {
            var d = this['data'];
            var ndx = 0;
            if (this['_'] === 0) {
                var highest = 0;
                for (var i = d.length - 1; i >= 0; i--) {
                    if (d[i] !== 0) {
                        highest = i;
                        break;
                    }
                }
                return {
                    'next': function () {
                        var n = ndx >>> WORD_LOG;
                        return {
                            'done': n > highest || n === highest && (d[n] >>> ndx) === 0,
                            'value': n > highest ? 0 : (d[n] >>> ndx++) & 1
                        };
                    }
                };
            }
            else {
                return {
                    'next': function () {
                        var n = ndx >>> WORD_LOG;
                        return {
                            'done': false,
                            'value': n < d.length ? (d[n] >>> ndx++) & 1 : 1,
                        };
                    }
                };
            }
        }
    };
    BitSet['fromBinaryString'] = function (str) {
        return new BitSet('0b' + str);
    };
    BitSet['fromHexString'] = function (str) {
        return new BitSet('0x' + str);
    };
    BitSet['Random'] = function (n) {
        if (n === undefined || n < 0) {
            n = WORD_LENGTH;
        }
        var m = n % WORD_LENGTH;
        var t = [];
        var len = Math.ceil(n / WORD_LENGTH);
        var s = Object.create(BitSet.prototype);
        for (var i = 0; i < len; i++) {
            t.push(Math.random() * 4294967296 | 0);
        }
        if (m > 0) {
            t[len - 1] &= (1 << m) - 1;
        }
        s['data'] = t;
        s['_'] = 0;
        return s;
    };
    const MAX_BITS = 1024;
    const MAX_BITS_STRING = "0".repeat(MAX_BITS);
    Achivements._testAddAchivements = function () {
        var set = new BitSet;
        set.set(64, 1);
        let formated = ("0".repeat(MAX_BITS) + set.toString()).slice(-1024);
        var updateUserDataResult = server.UpdateUserReadOnlyData({
            PlayFabId: currentPlayerId,
            Permission: "Public",
            Data: {
                "_A1": formated
            }
        });
    };
    Achivements.InitAchivements = function (cats) {
        var datas = {};
        for (var i = 0; i < cats.length; ++i) {
            datas[cats[i]] = MAX_BITS_STRING;
        }
        var updateUserDataResult = server.UpdateUserReadOnlyData({
            PlayFabId: currentPlayerId,
            Permission: "Public",
            Data: datas
        });
    };
})(Achivements || (Achivements = {}));
handlers["_testAddAchivements"] = Achivements._testAddAchivements;
handlers["InitAchivements"] = Achivements.InitAchivements;
//# sourceMappingURL=Achivements.js.map