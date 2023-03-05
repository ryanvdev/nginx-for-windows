export function isYes(v: string) {
    const tmp = v.toLowerCase();
    return tmp === 'yes' || tmp === 'y';
}

export function isNo(v: string) {
    const tmp = v.toLowerCase();
    return tmp === 'no' || tmp === 'n';
}
