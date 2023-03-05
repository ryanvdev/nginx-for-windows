import { exec, ExecOptions } from 'child_process';
import _ from 'lodash';
import ms from 'ms';

export interface ExecAsyncReturn {
    success: boolean;
    stdout: string[];
}

async function execAsync(command: string, options?: ExecOptions): Promise<ExecAsyncReturn> {
    return new Promise((resolve, reject) => {
        try {
            const childProcess = exec(
                command,
                {
                    windowsHide: true,
                    ...options,
                },
                (error, stdout, stderr) => {
                    if (error) {
                        resolve({
                            success: false,
                            stdout: error.message.split('\r\n'),
                        });
                        return;
                    }

                    const _stdout: string[] = stdout.split('\r\n').concat(stderr.split('\r\n'));

                    resolve({
                        success: true,
                        stdout: _stdout,
                    });
                },
            );
        } catch (e) {
            reject(e);
        }
    });
}

export default execAsync;
