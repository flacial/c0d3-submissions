import { spawn } from 'child_process';

class Commands {
  constructor() {
    this.commandsCache = {};
  }

  hasMaliciousChar = (command) => {
    const maliciousChars = [';', '|', '||', '&', '&&', '`', '$', '%0A'];

    return maliciousChars.some((char) => !command.includes(char));
  };

  getArgs = (command) => {
    const [fun, ...args] = command.split(' ');

    switch (fun) {
      case 'pwd':
        return { fun, args };
      case 'cat':
        return { fun, args: args.length ? args : ['package.json'] };
      case 'ls':
        return { fun, args };
      default:
        return null;
    }
  };

  sendCommandOutput = async (command) => {
    const resBody = { stdout: null, stderr: null };
    const args = this.getArgs(command);

    if (!args) {
      resBody.stderr = 'Error';
      return resBody;
    }

    const cmd = spawn(args.fun, args.args);

    cmd.stdout.on('data', (data) => {
      resBody.stdout = `${data}`;
    });

    cmd.stderr.on('data', (data) => {
      resBody.stderr = `${data}`;
    });

    return new Promise((res, _rej) => {
      cmd.addListener('exit', () => res(resBody));
    });
  };

  handleCommands = async (req, res) => {
    res.set('Cache-Control', 'max-age=3000');

    let command = req.body?.command;

    if (!command) return res.json({ output: 'Type a command' });

    command = command.trim();

    if (this.commandsCache[command]) {
      return res.send({ output: this.commandsCache[command] });
    }

    if (this.hasMaliciousChar(command)) {
      const { stdout, stderr } = await this.sendCommandOutput(command);

      if (stdout) this.commandsCache[command] = stdout;
      return res.json({
        output: stderr ? 'Error' : !stdout ? 'Empty Folder' : stdout,
      });
    }

    return res.send({
      output: 'Invalid Command',
    });
  };
}

export default Commands;
