import * as readline from 'node:readline/promises';
import { stdin, stdout as output } from 'node:process';

async function input(question?: string) {
    const rl = readline.createInterface({ input: stdin, output });
    const answer = await rl.question(question || '');
    rl.close();
    return answer;
}

export default input;
