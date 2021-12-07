export function isPromise(promise: any) {
    return !!promise && typeof promise === 'function' && typeof promise().then === 'function';
}
