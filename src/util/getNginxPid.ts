import fs from 'node:fs';
import gconst from './gconst';

function getNginxPid() {
    if (fs.existsSync(gconst.PID_FILEPATH)) {
        const strPid = fs.readFileSync(gconst.PID_FILEPATH, { encoding: 'utf-8' }).trim();
        if (!strPid) return undefined;
        const pid = parseInt(strPid);

        if (!isFinite(pid)) return undefined;

        return pid;
    }
    return undefined;
}

export function removeNginxPid() {
    if (fs.existsSync(gconst.PID_FILEPATH)) {
        return fs.unlinkSync(gconst.PID_FILEPATH);
    }
}

export default getNginxPid;
