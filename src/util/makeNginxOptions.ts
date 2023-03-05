import { toCommandOption } from './loadProgram';

function makeOption([key, value]: [key: string, value: string | boolean | undefined]) {
    if (value === undefined) return undefined;
    if (value === false) return undefined;
    if (value === true) return toCommandOption(key);
    return `${toCommandOption(key)} ${value}`;
}

function makeNginxOptions(args: IndexSignature<string | boolean | undefined>) {
    const nginxOptions = Object.entries(args)
        .map(makeOption)
        .filter((v) => v !== undefined)
        .join(' ');
    return nginxOptions;
}

export default makeNginxOptions;
