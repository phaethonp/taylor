const _nativeEnv = {
    // EVM specific
    add:          { mutable: false, arity: 2, inputs: [{type: 'uint', name: 'a'}, {type: 'uint', name: 'b'}], outputs: [{type: 'uint', name: 'c'}] },
    sub:          { mutable: false, arity: 2, inputs: [{type: 'uint', name: 'a'}, {type: 'uint', name: 'b'}], outputs: [{type: 'uint', name: 'c'}] },
    mul:          { mutable: false, arity: 2, inputs: [{type: 'uint', name: 'a'}, {type: 'uint', name: 'b'}], outputs: [{type: 'uint', name: 'c'}] },
    div:          { mutable: false, arity: 2, inputs: [{type: 'uint', name: 'a'}, {type: 'uint', name: 'b'}], outputs: [{type: 'uint', name: 'c'}] },
    sdiv:         { mutable: false, arity: 2, inputs: [{type: 'uint', name: 'a'}, {type: 'uint', name: 'b'}], outputs: [{type: 'uint', name: 'c'}] },
    mod:          { mutable: false, arity: 2, inputs: [{type: 'uint', name: 'a'}, {type: 'uint', name: 'b'}], outputs: [{type: 'uint', name: 'c'}] },
    smod:         { mutable: false, arity: 2, inputs: [{type: 'uint', name: 'a'}, {type: 'uint', name: 'b'}], outputs: [{type: 'uint', name: 'c'}] },
    exp:          { mutable: false, arity: 2, inputs: [{type: 'uint', name: 'a'}, {type: 'uint', name: 'b'}], outputs: [{type: 'uint', name: 'c'}] },
    not:          { mutable: false, arity: 1, inputs: [{type: 'uint', name: 'a'}], outputs: [{type: 'uint', name: 'c'}] },
    lt:           { mutable: false, arity: 2, inputs: [{type: 'uint', name: 'a'}, {type: 'uint', name: 'b'}], outputs: [{type: 'uint', name: 'c'}] },
    gt:           { mutable: false, arity: 2, inputs: [{type: 'uint', name: 'a'}, {type: 'uint', name: 'b'}], outputs: [{type: 'uint', name: 'c'}] },
    slt:          { mutable: false, arity: 2, inputs: [{type: 'uint', name: 'a'}, {type: 'uint', name: 'b'}], outputs: [{type: 'uint', name: 'c'}] },
    sgt:          { mutable: false, arity: 2, inputs: [{type: 'uint', name: 'a'}, {type: 'uint', name: 'b'}], outputs: [{type: 'uint', name: 'c'}] },
    eq:           { mutable: false, arity: 2, inputs: [{type: 'uint', name: 'a'}, {type: 'uint', name: 'b'}], outputs: [{type: 'uint', name: 'c'}] },
    iszero:       { mutable: false, arity: 1, inputs: [{type: 'uint', name: 'a'}], outputs: [{type: 'bool', name: 'c'}] },
    and:          { mutable: false, arity: 2, inputs: [{type: 'uint', name: 'a'}, {type: 'uint', name: 'b'}], outputs: [{type: 'uint', name: 'c'}] },
    or:           { mutable: false, arity: 2, inputs: [{type: 'uint', name: 'a'}, {type: 'uint', name: 'b'}], outputs: [{type: 'uint', name: 'c'}] },
    xor:          { mutable: false, arity: 2, inputs: [{type: 'uint', name: 'a'}, {type: 'uint', name: 'b'}], outputs: [{type: 'uint', name: 'c'}] },
    byte:         { mutable: false, arity: 2, inputs: [{type: 'uint', name: 'a'}, {type: 'uint', name: 'b'}], outputs: [{type: 'uint', name: 'c'}] },
    shl:          { mutable: false, arity: 2, inputs: [{type: 'uint', name: 'a'}, {type: 'uint', name: 'b'}], outputs: [{type: 'uint', name: 'c'}] },
    shr:          { mutable: false, arity: 2, inputs: [{type: 'uint', name: 'a'}, {type: 'uint', name: 'b'}], outputs: [{type: 'uint', name: 'c'}] },
    sar:          { mutable: false, arity: 2, inputs: [{type: 'uint', name: 'a'}, {type: 'uint', name: 'b'}], outputs: [{type: 'uint', name: 'c'}] },
    addmod:       { mutable: false, arity: 3, inputs: [{type: 'uint', name: 'a'}, {type: 'uint', name: 'b'}, {type: 'uint', name: 'c'}], outputs: [{type: 'uint', name: 'd'}] },
    mulmod:       { mutable: false, arity: 3, inputs: [{type: 'uint', name: 'a'}, {type: 'uint', name: 'b'}, {type: 'uint', name: 'c'}], outputs: [{type: 'uint', name: 'd'}] },
    signextend:   { mutable: false, arity: 2, inputs: [{type: 'uint', name: 'a'}, {type: 'uint', name: 'b'}], outputs: [{type: 'uint', name: 'c'}] },
    keccak256:    { mutable: false, arity: null, inputs: [{type: 'uint', name: 'a'}, {type: 'uint', name: 'b'}], outputs: [{type: 'uint', name: 'c'}] },
    call:         { mutable: true, arity: 7, notimp: true },
    callcode:     { mutable: true, arity: 7, notimp: true },
    delegatecall: { mutable: true, arity: 6, notimp: true },
    staticcall:   { mutable: false, arity: 6, notimp: true },
    
    // Mal specific
    list:         { mutable: false, arity: null },
    apply:        { mutable: false, arity: null },
    lambda:       { mutable: false, arity: null },
    'fn*':        { mutable: false, arity: null },
    'def!':       { mutable: false, arity: 2, inputs: [{type: 'symbol', name: 'name'}], outputs: [{type: 'function', name: 'Function'}] },
    getf:         { mutable: false, arity: null },
    if:           { mutable: false, arity: 3 },
    contig:       { mutable: false, arity: 2, inputs: [{type: 'uint', name: 'times'}, {type: 'bytes', name: 'bytes'}], outputs: [{type: 'bytes', name: 'bytes'}] },
    concat:       { mutable: false, arity: 2, inputs: [{type: 'bytes', name: 'arg1'}, {type: 'bytes', name: 'arg2'}], outputs: [{type: 'bytes', name: 'bytes'}] },
    map:          { mutable: false, arity: 2, inputs: [{type: 'function', name: 'function'}, {type: 'list', name: 'list'}], outputs: [{type: 'list', name: 'list'}] },
    reduce:       { mutable: false, arity: 3, inputs: [{type: 'function', name: 'function'}, {type: 'list', name: 'list'}, {type: 'uint', name: 'accumulator'}], outputs: [{type: 'uint', name: 'result'}] },
    nth:          { mutable: false, arity: 2, inputs: [{type: 'list', name: 'list'}, {type: 'uint', name: 'index'}], outputs: [{type: 'any', name: 'item'}] },
    first:        { mutable: false, arity: 1, inputs: [{type: 'list', name: 'list'}], outputs: [{type: 'any', name: 'item'}] },
    rest:         { mutable: false, arity: 1, inputs: [{type: 'list', name: 'list'}], outputs: [{type: 'list', name: 'rest'}] },
    'empty?':     { mutable: false, arity: 1, inputs: [{type: 'list', name: 'list'}], outputs: [{type: 'bool', name: 'c'}] },
    'true?':      { mutable: false, arity: 1, inputs: [{type: 'any', name: 'any'}], outputs: [{type: 'bool', name: 'c'}] },
    'false?':     { mutable: false, arity: 1, inputs: [{type: 'any', name: 'any'}], outputs: [{type: 'bool', name: 'c'}] },
    "let*":       { mutable: false, arity: 2, inputs: [{type: 'list', name: 'list'}, {type: 'uint', name: 'index'}], outputs: [{type: 'any', name: 'item'}] },

    // Mal specific - unimplemented, just placeholders
    cons:         { mutable: false, arity: 2, notimp: true },  // prepend item to list
    concat2:      { mutable: false, arity: null, notimp: true },  // concats lists
    'nil?':       { mutable: false, arity: 1 },
    'list?':      { mutable: false, arity: 1, notimp: true },
    vector:       { mutable: false, arity: null, notimp: true },
    'vector?':    { mutable: false, arity: 1, notimp: true },
    'sequential?':{ mutable: false, arity: 1, notimp: true },
    'hash-map':   { mutable: false, arity: null, notimp: true },
    'map?':       { mutable: false, arity: 1, notimp: true },
    assoc:        { mutable: false, arity: null, notimp: true },
    dissoc:       { mutable: false, arity: 2, notimp: true },
    get:          { mutable: false, arity: 2, notimp: true },
    'contains?':  { mutable: false, arity: 2, notimp: true },
    keys:         { mutable: false, arity: 1, notimp: true },
    vals:         { mutable: false, arity: 1, notimp: true },
    'fn?':        { mutable: false, arity: 1, notimp: true },
    'string?':    { mutable: false, arity: 1, notimp: true },
    'number?':    { mutable: false, arity: 1, notimp: true },
    seq:          { mutable: false, arity: 1, notimp: true },
    conj:         { mutable: false, arity: 1, notimp: true },
    symbol:       { mutable: false, arity: 1, notimp: true },
    'symbol?':    { mutable: false, arity: 1, notimp: true },
    keyword:      { mutable: false, arity: 1, notimp: true },
    'keyword?':   { mutable: false, arity: 1, notimp: true },
    count:        { mutable: false, arity: 1, notimp: true },
    do:           { mutable: false, arity: 1, notimp: true },
    'try*':       { mutable: false, arity: 2, notimp: true },
    'catch*':     { mutable: false, arity: 2, notimp: true },
    throw:        { mutable: false, arity: 1, notimp: true },
    'defmacro!':  { mutable: false, arity: 2, notimp: true },
    is_macro_call:{ mutable: false, arity: 2, notimp: true },
    macroexpand:  { mutable: false, arity: 2, notimp: true },
    atom:         { mutable: false, arity: 1, notimp: true },
    'atom?':      { mutable: false, arity: 1, notimp: true },
    deref:        { mutable: false, arity: 1, notimp: true },
    'swap!':      { mutable: false, arity: null, notimp: true },
    'reset!':     { mutable: false, arity: 1, notimp: true },
    'time-ms':    { mutable: false, arity: 0, notimp: true },
    meta:         { mutable: false, arity: 1, notimp: true },
    'with-meta':  { mutable: false, arity: 2, notimp: true },
    quote:        { mutable: false, arity: null, notimp: true },
    quasiquote:   { mutable: false, arity: null, notimp: true },
    prn:          { mutable: false, arity: null, notimp: true },
    'pr-str':     { mutable: false, arity: null, notimp: true },
    str:          { mutable: false, arity: null, notimp: true },
    println:      { mutable: false, arity: null, notimp: true },
    readline:     { mutable: false, arity: 1, notimp: true },
    
    // Taylor specific
    'register!':  { mutable: false, arity: 1, inputs: [{type: 'address', name: 'address'}], outputs: [] },
    'getregistered': { mutable: false, arity: 1, inputs: [{type: 'uint', name: 'uint'}], outputs: [] },
    'defstruct!': { mutable: false, arity: 2, inputs: [{type: 'symbol', name: 'name'}, {type: 'any', name: 'def'}], outputs: [] },

    // EVM - rest
    gas:         {mutable: false, arity: 0, inputs: [], outputs: [] },
    address:     {mutable: false, arity: 0, inputs: [], outputs: [] },
    balance:     {mutable: false, arity: 1, inputs: [{type: 'address', name: 'address'}], outputs: [] },
    caller:      {mutable: false, arity: 0, inputs: [], outputs: [] },
    callvalue:   {mutable: false, arity: 0, inputs: [], outputs: [] },
    calldataload:{mutable: false, arity: 0, inputs: [], outputs: [] },
    calldatasize:{mutable: false, arity: 0, inputs: [], outputs: [] },
    calldatacopy:{mutable: false, arity: 3, inputs: [{type: 'uint', name: 'uint'}, {type: 'uint', name: 'uint'}, {type: 'uint', name: 'uint'}], outputs: [] },
    codesize:    {mutable: false, arity: 0, inputs: [], outputs: [] },
    codecopy:    {mutable: false, arity: 3, inputs: [{type: 'uint', name: 'uint'}, {type: 'uint', name: 'uint'}, {type: 'uint', name: 'uint'}], outputs: [] },
    extcodesize: {mutable: false, arity: 1, inputs: [{type: 'address', name: 'address'}], outputs: [] },
    extcodecopy: {mutable: false, arity: 4, inputs: [{type: 'uint', name: 'uint'}, {type: 'uint', name: 'uint'}, {type: 'uint', name: 'uint'}, {type: 'uint', name: 'uint'}], outputs: [] },
    returndatasize:{mutable: false, arity: 0, inputs: [], outputs: [] },
    returndatacopy:{mutable: false, arity: 3, inputs: [{type: 'uint', name: 'uint'}, {type: 'uint', name: 'uint'}, {type: 'uint', name: 'uint'}], outputs: [] },
    extcodehash:{mutable: false, arity: 1, inputs: [{type: 'address', name: 'address'}], outputs: [] },
    create:      {mutable: false, arity: 3, inputs: [{type: 'uint', name: 'uint'}, {type: 'uint', name: 'uint'}, {type: 'uint', name: 'uint'}], outputs: [] },
    create2:     {mutable: false, arity: 4, inputs: [{type: 'uint', name: 'uint'}, {type: 'uint', name: 'uint'}, {type: 'uint', name: 'uint'}, {type: 'uint', name: 'uint'}], outputs: [] },
    log0:       {mutable: false, arity: 2, inputs: [{type: 'uint', name: 'uint'}, {type: 'uint', name: 'uint'}], outputs: [] },
    log1:       {mutable: false, arity: 3, inputs: [{type: 'uint', name: 'uint'}, {type: 'uint', name: 'uint'}, {type: 'uint', name: 'uint'}], outputs: [] },
    log2:       {mutable: false, arity: 4, inputs: [{type: 'uint', name: 'uint'}, {type: 'uint', name: 'uint'}, {type: 'uint', name: 'uint'}, {type: 'uint', name: 'uint'}], outputs: [] },
    log3:       {mutable: false, arity: 5, inputs: [{type: 'uint', name: 'uint'}, {type: 'uint', name: 'uint'}, {type: 'uint', name: 'uint'}, {type: 'uint', name: 'uint'}, {type: 'uint', name: 'uint'}], outputs: [] },
    log4:       {mutable: false, arity: 6, inputs: [{type: 'uint', name: 'uint'}, {type: 'uint', name: 'uint'}, {type: 'uint', name: 'uint'}, {type: 'uint', name: 'uint'}, {type: 'uint', name: 'uint'}, {type: 'uint', name: 'uint'}], outputs: [] },
    chainid:    {mutable: false, arity: 0, inputs: [], outputs: [] },
    origin:     {mutable: false, arity: 0, inputs: [], outputs: [] },
    blockhash:  {mutable: false, arity: 0, inputs: [], outputs: [] },
    coinbase:   {mutable: false, arity: 0, inputs: [], outputs: [] },
    timestamp:  {mutable: false, arity: 0, inputs: [], outputs: [] },
    number:     {mutable: false, arity: 0, inputs: [], outputs: [] },
    difficulty: {mutable: false, arity: 0, inputs: [], outputs: [] },
    gaslimit:   {mutable: false, arity: 0, inputs: [], outputs: [] },

    // Taylor
    'save!':  { mutable: false, arity: 2 },
    getfrom:     { mutable: false, arity: 2 },
    struct:   { mutable: false, arity: 2, inputs: [{type: 'symbol', name: 'name'}, {type: 'list', name: 'values'}], outputs: [] },
    'struct!':   { mutable: false, arity: 2, inputs: [{type: 'symbol', name: 'name'}, {type: 'list', name: 'values'}], outputs: [] }, // todo: remove
    rcall:    { mutable: true, arity: 3 },
    array:    { mutable: false, arity: null },
    'savedyn!':  { mutable: false, arity: 2, notimp: true }, // obsolete
    'push!':  { mutable: false, arity: 3 },
    getdyn: { mutable: false, arity: 2, notimp: true },  // obsolete
    'store!': { mutable: false, arity: 2 },
    sload:    { mutable: false, arity: 2 },
    revert:   { mutable: false, arity: 1 },
    return:   { mutable: false, arity: 1 },
    'list-struct': { mutable: false, arity: 1 },
    'defmap!': { mutable: false, arity: 3 },
    'mapset!': { mutable: false, arity: 3 },
    mapget: { mutable: false, arity: 2 },

    // TODO: curry
    // TODO: pay
}


const _nativeEnv_docs = {
    // EVM specific
    add:          { docs: 'x + y' },
    sub:          { docs: 'x - y' },
    mul:          { docs: 'x * y' },
    div:          { docs: 'x / y or 0 if y == 0' },
    sdiv:         { docs: 'x / y, for signed numbers in two’s complement, 0 if y == 0' },
    mod:          { docs: 'x % y, 0 if y == 0' },
    smod:         { docs: 'x % y, for signed numbers in two’s complement, 0 if y == 0' },
    exp:          { docs: 'x to the power of y' },
    not:          { docs: 'bitwise “not” of x (every bit of x is negated)' },
    lt:           { docs: '1 if x < y, 0 otherwise' },
    gt:           { docs: '1 if x > y, 0 otherwise' },
    slt:          { docs: '1 if x < y, 0 otherwise, for signed numbers in two’s complement' },
    sgt:          { docs: '1 if x > y, 0 otherwise, for signed numbers in two’s complement' },
    eq:           { docs: '' },
    iszero:       { docs: '' },
    and:          { docs: '' },
    or:           { docs: '' },
    xor:          { docs: '' },
    byte:         { docs: '' },
    shl:          { docs: '' },
    shr:          { docs: '' },
    sar:          { docs: '' },
    addmod:       { docs: '' },
    mulmod:       { docs: '' },
    signextend:   { docs: '' },
    keccak256:    { docs: '' },
    call:         { docs: '' },
    callcode:     { docs: '' },
    delegatecall: { docs: '' },
    staticcall:   { docs: '' },
    
    // Mal specific
    list:         { docs: '' },
    apply:        { docs: '' },
    lambda:       { docs: '' },
    'fn*':        { construct: 'fn* (a b) (add a b)' },
    'def!':       { construct: 'def! name (fn* (a) a)' },
    getf:         { docs: '' },
    if:           { construct: 'if condition 1 2'},
    contig:       { docs: '' },
    concat:       { docs: '' },
    map:          { docs: '' },
    reduce:       { docs: '' },
    nth:          { docs: '' },
    first:        { docs: '' },
    rest:         { docs: '' },
    'empty?':     { docs: '' },
    'true?':      { docs: '' },
    'false?':     { docs: '' },
    "let*":       { docs: '' },

    // Taylor specific
    'register!':  { },
    'getregistered': { },
    'defstruct!': { },
}

Object.keys(_nativeEnv_docs).forEach(name => {
    _nativeEnv[name] = Object.assign(_nativeEnv[name], _nativeEnv_docs[name]);
})

module.exports = _nativeEnv;
