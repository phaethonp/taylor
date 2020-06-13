const ethers = require('ethers');
const { hexZeroPad } = ethers.utils;
const malReader = require('./mal/reader.js');
const malTypes = require('./mal/types.js');
const _nativeEnv = require('./native.js');
const malBackend = require('./mal_backend.js');
require('./extensions.js');
const BN = require('bn.js');

const u2b = value => value.toString(2);
const u2h = value => value.toString(16);
const b2u = value => parseInt(value, 2);
const b2h = value => u2h(b2u(value));
const h2u = value => parseInt(value, 16);
const h2b = value => u2b(h2u(value));
const x0 = value => '0x' + value;
const strip0x = value => value.substring(0, 2) === '0x' ? value.substring(2) : value;

const bytesMarker = '0x';
const arityb = arity => u2b(arity).padStart(4, '0');
const mutableb = mutable => mutable ? '1' : '0';
const fidb = id => u2b(id).padStart(26, '0');
const funcidb = name => {
    const nativef = typeof name === 'string' ? nativeEnv[name] : name;
    if (nativef.hex) return nativef;
    
    let binf, hex;
    if (!nativef.composed) {
        binf = arity => '1' + arityb(arity) + fidb(nativef.id) + mutableb(nativef.mutable);
    } else {
        const composedf = nativef.composed.map(cname => funcidb(cname));
        binf = arities => composedf.map((funcs, i) => typeof funcs.bin === 'string' ? funcs.bin : funcs.bin(arities[i])).join('');
        hex = arities => composedf.map((funcs, i) => typeof funcs.hex === 'string' ? funcs.hex : funcs.hex(arities[i])).join('');
    }
    
    if (nativef.arity !== null) {
        const bin = binf(nativef.arity);
        return { bin, hex: b2h(bin) }
    }
    return { bin: binf, hex: hex || (arity => b2h(binf(arity))) }
}
const unknown = index => {
    let id = b2h(typeid.unknown + '0'.padStart(24, '0')).padStart(8, '0');
    let value = u2h(index).padStart(8, '0');
    return id + value;
}
const listTypeId = len => strip0x(hexZeroPad(x0(b2h(
    typeid.list + u2b(1).padStart(4, '0') + len
)), 4));

const typeid = {
    function: '1',
    array: '01',
    struct: '001',
    list: '0001',
    number: '00001',
    bytelike: '000001',
    enum: '0000001',
    unknown: '00000001',
}
const fulltypeidHex = {
    // nil shorthand for empty list
    Nil: listTypeId(0),
    None: '',
    // unit - equivalent to void, for functions without return type
    Unit: '',
    // trait
    Nothing: b2h('00000000000000000000000000000000'),
    Any: b2h('00000000000000000000000000000001'),
}

const numberid = {
    complex: '00000000000',
    real: '01000000000',
    bigfloat: '01000000000',
    float: '01000001000',
    irrational: '01001000000',
    bool: '01010000000',
    bigint: '01010001000',
    int: '01010001001',
    biguint: '01010010000',
    uint: '01010010001',
    rational: '', // TODO
}



const nativeEnv = {};
Object.keys(_nativeEnv).forEach((key, id) => {
    if (_nativeEnv[key].notimp) return;
    nativeEnv[key] = _nativeEnv[key];
    nativeEnv[key].id = id + 1;
    nativeEnv[key].idb = fidb(nativeEnv[key].id);
    nativeEnv[key].idmask = '10000' + nativeEnv[key].idb + '0';
    nativeEnv[key].idmaskhex = b2h(nativeEnv[key].idmask);
    const { bin, hex } = funcidb(key);
    nativeEnv[key].encoded = bin;
    nativeEnv[key].hex = hex;
});
nativeEnv.lambda.encoded = bodylenb => '100011' + u2b(bodylenb / 2).padStart(25, '0') + '0';
nativeEnv.lambda.hex = bodylenb => b2h(nativeEnv.lambda.encoded(bodylenb));

// console.log('nativeEnv', nativeEnv);

const reverseNativeEnv = {};
Object.keys(nativeEnv).forEach(key => {
    if (typeof nativeEnv[key].hex === 'string') {
        reverseNativeEnv[nativeEnv[key].hex] = key;
    }
});
// console.log('reverseNativeEnv', reverseNativeEnv)

const formatId = id => strip0x(hexZeroPad(x0(b2h(id)), 4));
const getnumberid = size => formatId(typeid.number + numberid.uint + u2b(size).padStart(16, '0'))
const getboolid = value => formatId(typeid.number + numberid.bool + u2b(value ? 1 : 0).padStart(16, '0'));
const getbytesid = length => formatId(typeid.bytelike + u2b(length).padStart(26, '0'));

const isFunction = sig => (sig & 2147483648) !== 0;
const isLambda = sig => (sig & 0x4000000) !== 0;
const isApply = sig => (sig & 0x7fffffe) === 0x40;
const isList = sig => (sig & 0x7fffffe) === 0x3e;
const isArray = sig => (sig & 0x40000000) !== 0;
const isStruct = sig => (sig & 0x20000000) !== 0;
const isListType = sig => (sig & 0x10000000) !== 0;
const isNumber = sig => (sig & 0x8000000) !== 0;
const isBool = sig => (sig & 0xffff0000) === 0x0a800000;
const isBytelike = sig => (sig & 0x4000000) !== 0;
const isEnum = sig => (sig & 0x2000000) !== 0;
const isLambdaUnknown = sig => (sig & 0x1000000) !== 0;
const isGetByName = sig => (sig & 0x7fffffe) === 0x48;

const numberSize = sig => sig & 0xffff;
const listTypeSize = sig => sig & 0xffffff;
const bytelikeSize = sig => sig & 0x3ffffff;
const funcArity = sig => (sig & 0x78000000) >> 27;
const lambdaLength = sig => (sig & 0x3fffffe) >> 1;
const getSignatureLength = 4;
// const getValueLength = 

const tableSig = {}
tableSig[nativeEnv['def!'].hex] = {offsets: [64, 8], aritydelta: -1}
tableSig[nativeEnv['if'].hex] = {offsets: [8, 8], aritydelta: 0}
tableSig['lambda'] = {offsets: lambdaLength}
tableSig['isGetByName'] = {offsets: [64]}

const encodeInner = (types, values) => {
    if (types.length !== values.length) throw new Error('Encode - different lengths.');
   return types.map((t, i) => {
        switch (t.type) {
            case 'uint':
                const id = getnumberid(t.size)
                const value = parseInt(values[i]);
                const padded = strip0x(hexZeroPad(
                    x0(u2h(value)),
                    t.size
                ));
                return id + padded;
            case 'bytes':
                if (!ethers.utils.isHexString(x0(strip0x(values[i])))) {
                    throw new Error('Invalid bytes literal.')
                }
                const val = strip0x(values[i]);
                const length = val.length / 2;
                return  getbytesid(length) + val;
            case 'list':
                let len = u2b(values[i].length).padStart(24, '0');
                const lid = listTypeId(len);

                return lid + values[i].map(value => encodeInner([{type: 'uint', size: 4}], [value]))
                    .join('');
            case 'bool':
                return getboolid(values[i]);
            default:
                throw new Error('Not implemented');
        }
    }).join('');
}

const encode = (types, values) => {
    return '0x' + encodeInner(types, values);
}

const decodeInner = (sig, data) => {
    let result;
    if (isBool(sig)) {
        if (sig === 0x0a800001) result = true;
        else if (sig === 0x0a800000) result = false;
        else throw new Error('Bool is not bool.');
        return { result, data };
    }
    if (isNumber(sig)) {
        const size = numberSize(sig);
        result = new BN(data.substring(0, size*2), 16);

        result = result.lt(new BN(2).pow(new BN(16))) ? result.toNumber() : result;

        data = data.substring(size*2);
        return { result, data };
    } else if (isBytelike(sig)) {
        const length = bytelikeSize(sig);
        result = '0x' + data.substring(0, length*2)
        data = data.substring(length*2);
        return { result, data };
    } else if (isListType(sig)) {
        const length = listTypeSize(sig);
        
        const result = [...new Array(length)].map((_, i) => {
            const partsig = parseInt(data.substring(0, 8), 16);
            let result;
            ({result, data} = decodeInner(partsig, data.substring(8)));
            return result;
        });
        return { result, data };
    } else {
        throw new Error('decode type not supported: ' + sig);
    }
}

const decode = data => {
    data = strip0x(data);
    const decoded = [];

    while (data.length > 0) {
        let result;
        const sig = parseInt(data.substring(0, 8), 16);
        ({result, data} = decodeInner(sig, data.substring(8)));
        decoded.push(result);
    }
    return decoded.length > 1 ? decoded : decoded[0];
}

const ast2h = (ast, parent=null, unkownMap={}, defenv={}) => {
    // do not count the function itselt
    const arity = ast.length - 1;

    if (ast[0] && ast[0].value === 'def!') {
        const elem = ast[0];
        const defname = ast[1].value.hexEncode().padStart(64, '0');
        // We add the function as an already stored function
        // -> the contract loads the recursive function from storage each time 
        const newdefenv = Object.assign({}, defenv);
        newdefenv[ast[1].value] = true;
        const exprbody = ast2h(ast[2], ast, unkownMap, newdefenv);
        const exprlen = u2h(exprbody.length / 2).padStart(8, '0');
        return nativeEnv[elem.value].hex + defname + exprlen + exprbody;
    }

    return ast.map((elem, i) => {
        // if Symbol
        if (malTypes._symbol_Q(elem)) {
            if (!nativeEnv[elem.value]) {
                if (elem.value === bytesMarker) {
                    const typeid = getbytesid(ast[i + 1].length / 2);
                    return  typeid + ast[i + 1];
                }
                
                // check if stored function first
                if (!unkownMap[elem.value] && defenv[elem.value]) {
                    // TODO proper type - string/bytes
                    const encodedName = getnumberid(32) + elem.value.hexEncode().padStart(64, '0');

                    // if function is first arg, it is executed
                    // otherwise, it is referenced as an argument (lambda)
                    let arity = ast[0].value === elem.value ? ast.length : 1;
                    // getf <fname>
                    return nativeEnv.getf.hex(arity) + encodedName;
                }
                
                // lambda variables should end up here
                // lambda argument definition
                if (!unkownMap[elem.value]) {
                    unkownMap[elem.value] = unknown(i);
                    // TODO: now we don't include `(a, b)` from `fn* (a b) (add a b)`
                    return '';
                }
                return unkownMap[elem.value];
            }
            if (elem.value === 'if') {
                const action1body = ast2h([ast[2]], null, unkownMap, defenv);
                const action2body = ast2h([ast[3]], null, unkownMap, defenv);
                return nativeEnv[elem.value].hex
                    + u2h(action1body.length / 2).padStart(8, '0')
                    + u2h(action2body.length / 2).padStart(8, '0');
            }

            if (elem.value === 'fn*') {
                const lambdaBody = ast2h([ast[1], ast[2]], null, {}, defenv);
                let encoded = nativeEnv.lambda.hex(lambdaBody.length);
                const arity = ast[1].length;

                // we execute it with apply only if there is a parent ast
                // with this lambda at index 0
                if (parent && parent[0][0] && parent[0][0].value === elem.value) {
                    // apply arity: 1 + number of args
                    encoded = nativeEnv.apply.hex(arity + 1) + encoded;
                }
                return encoded;
            }

            let encoded;
            if (typeof nativeEnv[elem.value].hex === 'string') {
                encoded = nativeEnv[elem.value].hex;
            }
            if (typeof nativeEnv[elem.value].hex === 'function') {
                encoded = nativeEnv[elem.value].hex(arity);
            }

            if (ast[0].value === elem.value) return encoded;
            else return getbytesid(4) + encoded;

            throw new Error('Unexpected native function: ' + elem.value);
        }

        if (typeof elem === 'string' && elem.substring(0, 2) === bytesMarker) {
            const val = elem.substring(2);
            const typeid = getbytesid(val.length / 2);
            return  typeid + val;
        }

        if (elem instanceof Array) {
            return ast2h(elem, ast, unkownMap, defenv);
        }

        if (typeof elem === 'boolean') {
            return encodeInner([{type: 'bool'}], [elem]);
        }

        // TODO
        if (
            (parseInt(elem) || parseInt(elem) === 0)
            && (!ast[i - 1] || ast[i - 1].value !== bytesMarker)
        ) {
            return encodeInner([{type: 'uint', size: 4}], [elem]);
        }

    }).join('');
}

const expr2h = (expression, defenv) => {
    const ast = malReader.read_str(expression);
    return x0(ast2h(ast, null, {}, defenv));
}

const expr2string = (inidata, pos=0, accum='') => {
    let name, arity;
    let unknownList = [];
    let data = inidata.substring(pos);
    const sig = data.substring(0, 8);
    const sigu = parseInt(sig, 16);
    data = data.substring(8);
    pos += 8;

    const isf = isFunction(sigu);

    if (isf) {
        if (reverseNativeEnv[sig]) {
            name =  reverseNativeEnv[sig];
            accum += '(' + name + ' ';
            arity = funcArity(sigu);
        }
        
        if (name === 'def!') {
            const fname = data.substring(0, tableSig[sig].offsets[0]).hexDecode();
            accum += ' ' + fname.toString() + ' ';
            data = data.substring(tableSig[sig].offsets[0]);
            pos += tableSig[sig].offsets[0]
            
            const exprlen = data.substring(0, tableSig[sig].offsets[1]);
            data = data.substring(tableSig[sig].offsets[1]);
            pos += tableSig[sig].offsets[1]

            const res = expr2string(inidata, pos, accum);
            pos = res.pos;
            accum = res.accum;
        } else if (name === 'if') {
            const action1bodyLen = parseInt(data.substring(0, tableSig[sig].offsets[0]), 16);
            const action2bodyLen = parseInt(data.substring(0, tableSig[sig].offsets[1]), 16);
            
            let res = expr2string(inidata, pos + tableSig[sig].offsets[0] + tableSig[sig].offsets[1], accum);
            pos = res.pos;
            accum = res.accum;

            res = expr2string(inidata, pos, accum)
            pos = res.pos;
            accum = res.accum;
            res = expr2string(inidata, pos, accum)
            pos = res.pos;
            accum = res.accum;

        } else if (isLambda(sigu)) {
            accum += '( fn* () '
            const bodylen = tableSig.lambda.offsets(sigu);
            const res = expr2string(inidata, pos, accum)
            accum = res.accum;
        } else if (isGetByName(sigu)) {
            const fname = data.substring(8, tableSig.isGetByName.offsets[0]+8).hexDecode();
            accum += '( _' + fname + ' '
            pos += tableSig.isGetByName.offsets[0] + 8
            const res = expr2string(inidata, pos, accum)
            accum = res.accum;
        }
        else {
            for(let i = 0; i < arity; i++) {
                let res = expr2string(inidata, pos , accum)
                pos = res.pos;
                accum = res.accum;
            }
        }
        accum += ')'
    }
    else if (isLambdaUnknown(sigu)) {
        const index = parseInt(data.substring(0, 8), 16)
        const uname = 'u_'+index + ' '
        unknownList.push(uname);
        accum += ' ' + uname
        pos += 8
    }
    else {
        const res = decodeInner(sigu, data)
        accum += ' ' + res.result.toString()
        pos = inidata.length - res.data.length;
    }
    return { pos, accum };
}

const expr2s = inidata => expr2string(strip0x(inidata)).accum;


const DEFAULT_TXOBJ = {
    gasLimit: 1000000,
    value: 0,
    gasPrice: 10
}
  
const sendTransaction = signer => address => async (data, txObj = {}) => {
    const transaction = Object.assign({}, DEFAULT_TXOBJ, txObj, {
        data,
        to: address,
    });
    const response = await signer.sendTransaction(transaction);
    response.wait().then(receipt => {
        if (receipt.status === 0) {
            throw new Error('Transaction failed');
        }
    })
    return response;
}
  
const call = provider => address => async (data, txObj = {}) => {
    const transaction = Object.assign({
        to: address,
        data,
    }, txObj);
    return await provider.call(transaction);
}
  
const getLogs = provider => address => async (topic, filter = {} ) => {
    filter = Object.assign({
        address: address,
        topics: [ topic ],
        fromBlock: 0,
        toBlock: 'pending',
    }, filter);
    return provider.getLogs(filter);
}
  
const getStoredFunctions = getLogs => async (filter) => {
    const topic = '0x00000000000000000000000000000000000000000000000000000000ffffffff';
    const logs = await getLogs(topic, filter);
  
    return logs.map(log => {
        log.name = log.topics[1].substring(2).hexDecode();
        log.signature = '0x' + log.topics[2].substring(58);
        return log;
    });
}

const getRegisteredContracts = call_raw => async () => {
    let count = await call_raw('0x44444440');
    count = parseInt(count, 16);
    let registered = new Set();

    for (let i = 1; i <= count; i ++) {
      const expr = expr2h('(getregistered ' + i + ')');
      let raddr = await call_raw(expr);
      raddr = '0x' + raddr.substring(10);
      registered.add(raddr);
    }

    return [...registered];
}

const getTaylor = (provider, signer) => (address, deploymentBlock = 0) => {
    const interpreter = {
        address: address.toLowerCase(),
        send_raw: sendTransaction(signer)(address),
        call_raw: call(provider)(address),
        fromBlock: deploymentBlock,
        getLogs: getLogs(provider)(address),
        getFns: getStoredFunctions(getLogs(provider)(address)),
        functions: {},
        registered: {},
        provider,
        signer,
    }
    
    interpreter.call = async (mal_expression, txObj) => decode(await interpreter.call_raw(expr2h(mal_expression, interpreter.functions), txObj));
    interpreter.send = async (mal_expression, txObj) => interpreter.send_raw(expr2h(mal_expression, interpreter.functions), txObj);

    interpreter.getregistered = getRegisteredContracts(interpreter.call_raw);

    interpreter.setOwnFunctions = async () => {
        let functions = await interpreter.getFns({fromBlock: interpreter.fromBlock, toBlock: 'pending'});
        functions.forEach(f => {
            interpreter.functions[f.name] = { signature: f.signature, own: true };

        });
    }
    
    interpreter.setRegistered = async () => {
        const raddrs = await interpreter.getregistered();
        for (let raddr of raddrs) {
            const rinstance = getTaylor(provider, signer)(raddr);
            await rinstance.init();
            interpreter.registered[raddr] = rinstance;
            Object.keys(rinstance.functions).forEach(key => {
                if (!interpreter.functions[key]) {
                    interpreter.functions[key] = rinstance.functions[key];
                    interpreter.functions[key].registered = true;
                }
            });
        }
    }

    interpreter.sendAndWait = async (mal_expression, txObj) => {
        let receipt = await interpreter.send(mal_expression, txObj);
        if (receipt.wait) {
            receipt = await receipt.wait();
        }

        // TODO: make this more efficient - wait for the last log and include it
        // instead of getting all the data from scratch
        if (mal_expression.includes('def!')) {
            await interpreter.setOwnFunctions();
        }

        if (mal_expression.includes('register!')) {
            await interpreter.setRegistered();
        }
        return receipt;
    }

    // populates with all functions, including those stored in registered contracts
    interpreter.init = async () => {
        await interpreter.setOwnFunctions();
        await interpreter.setRegistered();
    }

    const funcsFilter = { address, topics: ['0x00000000000000000000000000000000000000000000000000000000ffffffff']}
    const registeredTopic = { address, topics: ['0x00000000000000000000000000000000000000000000000000000000fffffffe']}
    const funccb = callb => log => {
        log.name = log.topics[1].substring(2).hexDecode();
        log.signature = '0x' + log.topics[2].substring(58);

        interpreter.functions[log.name] = { signature: log.signature, own: true };
        if (callb) callb({logtype: 'function', log});
    }
    const regcb = callb => log => {
        log.address =  '0x' + log.topics[1].substring(26);

        const inst = getTaylor(provider, signer)(log.address);
        interpreter.registered[log.address] = inst;
        inst.init();
        if (callb) callb({logtype: 'registered', log});
    }
    let watchers = {};

    interpreter.watch = callb => {
        if (watchers.funcs) return;
        watchers.funcs = funccb(callb);
        watchers.reg = regcb(callb);
        provider.on(funcsFilter, watchers.funcs);
        provider.on(registeredTopic, watchers.reg);
    }

    interpreter.unwatch = () => {
        provider.removeListener(funcsFilter, watchers.funcs);
        provider.removeListener(registeredTopic, watchers.reg);
        delete watchers.funcs;
        delete watchers.reg;
    }

    return interpreter;
}

module.exports = {
    u2b, u2h, b2u, b2h, h2u, h2b,
    typeid, nativeEnv, reverseNativeEnv,
    encode,
    decode,
    expr2h,
    funcidb,
    expr2s,
    malBackend,
    getTaylor,
}

