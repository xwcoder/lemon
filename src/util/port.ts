import * as os from 'os';
import { exec, execSync } from 'child_process';

interface Options {
  n?: number // get how many available port, default is 1
  start?: number // default is 4000
  end?: number // default is 65535
}

const format = (stdout: string, num: number) => {
  const list = stdout.split('\n')
    .map((item) => parseInt(item, 10))
    .filter((item) => !Number.isNaN(item));

  return num === 1 ? list[0] || null : list.slice(0, num);
};

const getCommand = (options: Options): string => {
  const osType = os.type();
  const { n, start, end } = options;

  if (osType === 'Linux') {
    return `comm -23 <(seq ${start} ${end} | sort) <(ss -tan | awk '{print $4}' | cut -d':' -f2 | grep "[0-9]{1,5}" | sort -u) |  sort -un | head -n ${n}`;
  }

  if (osType === 'Darwin') {
    return `comm -23 <(seq ${start} ${end}) <(netstat -an -p 'tcp' | grep -v tcp46 | grep tcp4 | awk '{print $4}' | cut -d'.' -f5 | grep -E '[0-9]{1,5}' | sort -un) | head -n ${n}`;
  }

  throw new Error('unsupported os');
};

const defaultOptoins: Options = {
  n: 1,
  start: 4000,
  end: 65535,
};

export const getAvailablePort = (
  options: Options = {},
):Promise<number | number[]> => new Promise((resolve, reject) => {
  const opts = {
    ...defaultOptoins,
    ...options,
  };
  const command = getCommand(opts);
  const { n } = opts;

  exec(command, { shell: '/bin/bash' }, (err, stdout) => {
    if (err) {
      reject(err);
    } else {
      resolve(format(stdout, n));
    }
  });
});

export const getAvailablePortSync = (options: Options = {}): number | number[] => {
  const opts = {
    ...defaultOptoins,
    ...options,
  };
  const command = getCommand(opts);
  const { n } = opts;

  const stdout = execSync(command, { encoding: 'utf8', shell: '/bin/bash' });
  return format(stdout, n);
};
