import _ from 'lodash';
import ms from 'ms';
import execAsync from './util/execAsync';
import gconst from './util/gconst';
import getNginxPid, { removeNginxPid } from './util/getNginxPid';
import input from './util/input';
import loadProgram, { ArgsType, helpInformation } from './util/loadProgram';
import makeNginxOptions from './util/makeNginxOptions';
import { printLines } from './util/printStdout';
import zf from './util/zf';

async function handlerStart(args: ArgsType) {
    const nginxPid = getNginxPid();

    if (nginxPid !== undefined) {
        console.log(`Nginx is running with PID: ${nginxPid}`);
        const isYes = zf.isYes(await input(`Do you want to run a new nginx process ? [yes/no]: `));

        if (!isYes) return;
    }

    const strCommand = ['start', gconst.NGINX, makeNginxOptions(args)].join(' ');

    const { stdout, success } = await execAsync(strCommand, {
        cwd: gconst.NGINX_ROOT_DIR,
        timeout: ms('3s'),
    });

    if (success) {
        console.log(`Nginx start with PID: ${getNginxPid()}`);
    } else {
        printLines(stdout);
    }
}

async function handlerKill() {
    const { stdout, success } = await execAsync('taskkill /f /im nginx.exe');
    removeNginxPid();
    printLines(stdout);
}

async function handlerSitesEnabled() {
    const { stdout, success } = await execAsync(`code ${gconst.SITES_ENABLED_DIR}`);
    printLines(stdout);
}

async function handlerStatus() {
    const { stdout, success } = await execAsync(`tasklist /FI "IMAGENAME eq nginx.exe"`);
    printLines(stdout);
}

async function handlerRun(args: ArgsType) {
    const keys = Object.keys(args);

    if (keys.length == 2 && _.isEqual(keys, ['prefix', 'filename'])) {
        console.log(helpInformation());
        return;
    }

    const nginxOptions = makeNginxOptions(args);
    const { stdout, success } = await execAsync(`${gconst.NGINX} ${nginxOptions}`);
    printLines(stdout);
}

const main = async () => {
    const { args, opts } = loadProgram();

    switch (args.action) {
        case 'start': {
            return await handlerStart(opts);
        }
        case 'test': {
            return await handlerRun({
                ...opts,
                test: true,
            });
        }
        case 'kill': {
            return await handlerKill();
        }
        case 'sites-enabled': {
            return await handlerSitesEnabled();
        }
        case 'status': {
            return await handlerStatus();
        }
        case 'stop':
        case 'quit':
        case 'reopen':
        case 'reload': {
            return await handlerRun({
                ...opts,
                signal: args.action,
            });
        }
        case 'run': {
            return await handlerRun(opts);
        }
        default: {
            throw new Error(`Not support action ${args.action}`);
        }
    }
};

main();
