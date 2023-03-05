import { Argument, Command, Option } from 'commander';
import path from 'path';
import z from 'zod';
import _ from 'lodash';
import gconst from './gconst';

export type ArgsType = ReturnType<typeof parseOptions>;

const storage: {
    optionNames: IndexSignature<string>;
    program: Command | undefined;
} = {
    optionNames: {},
    program: undefined,
};

function addToArgNames(options: Option[] | readonly Option[]) {
    const { optionNames } = storage;

    for (const option of options) {
        const short = option.short;
        const long = option.long?.slice(2);

        if (!short || !long) continue;
        optionNames[_.camelCase(long)] = short;
    }
}

function toLinuxPath(v: string) {
    return v.replaceAll('\\', '/');
}

function parseOptions(v: unknown) {
    const parser = z.object({
        prefix: z.string().transform(toLinuxPath).default(gconst.NGINX_ROOT_DIR),
        filename: z.string().transform(toLinuxPath).default(gconst.NGINX_CONFIG_FILEPATH),
        signal: z.enum(['stop', 'quit', 'reopen', 'reload']).optional(),
        version: z.boolean().optional(),
        versionConfigure: z.boolean().optional(),
        test: z.boolean().optional(),
        testDump: z.boolean().optional(),
        suppressNonError: z.boolean().optional(),
        directives: z.string().optional(),
    });
    return parser.parse(v);
}

function parseArguments(v: unknown) {
    const parser = z
        .tuple([
            z.enum([
                'test',
                'run',
                'start',
                'stop',
                'quit',
                'reopen',
                'reload',
                'kill',
                'sites-enabled',
                'status',
                'root-dir',
                'nginx.conf',
            ]),
        ])
        .transform((v) => {
            return {
                action: v[0],
            };
        });
    return parser.parse(v);
}

const loadProgram = _.once(() => {
    storage.program = new Command();
    // prettier-ignore
    storage.program
    .addArgument(
        new Argument(
            '[string]',
            'test, run, start, stop, quit, reopen, reload, kill, sites-enabled, status'
        ).default('run')
    )
    .option(
        '-v --version',
        'Show version and exit'
    )
    .option(
        '-V --version-configure',
        'Show version and configure options then exit'
    )
    .option('-t --test', 'Test configuration and exit')
    .option('-T --test-dump', 'Test configuration, dump it and exit')
    .option('-q --suppress-non-error', 'Suppress non-error messages during configuration testing')
    .option('-s --signal <string>', 'Send signal to a master process: stop, quit, reopen, reload')
    .option('-p --prefix <string>', `Set prefix path (default: ${gconst.NGINX_ROOT_DIR})`)
    .option('-c --filename <string>', `Set configuration file (default: ${gconst.NGINX_CONFIG_FILEPATH})`)
    .option('-g --directives <string>', 'Set global directives out of configuration file')
    .parse();

    const opts = parseOptions(storage.program.opts());
    const args = parseArguments([...storage.program.processedArgs]);
    addToArgNames(storage.program.options);

    return {
        opts,
        args,
    };
});

export function helpInformation() {
    return storage.program?.helpInformation();
}

export function toCommandOption(v: string) {
    return storage.optionNames[v];
}

export default loadProgram;
