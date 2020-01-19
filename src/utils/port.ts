import * as os from 'os'
import { exec, execSync } from 'child_process'

interface GetAvailablePortOption {
  n?: number // get how many available port, default is 1
  start?: number // default is 4000
  end?: number // default is 65535
  async?: boolean // default is false
}

// tslint:disable-next-line:max-line-length
export function getAvailablePort (options: GetAvailablePortOption = {}): number | number[] | Promise<number | number[]> {

  const defaultOptoins: GetAvailablePortOption = {
    n: 1,
    start: 4000,
    end: 65535,
    async: false
  }

  options = {
    ...defaultOptoins,
    ...options
  }

  const { n, start, end, async } = options

  const osType = os.type()

  let command

  if (osType === 'Linux') {
    // tslint:disable-next-line:max-line-length
    command = `comm -23 <(seq ${start} ${end} | sort) <(ss -tan | awk '{print $4}' | cut -d':' -f2 | grep "[0-9]\{1,5\}" | sort -u) |  sort -un | head -n ${n}`
  } else if (osType === 'Darwin') {
    // tslint:disable-next-line:max-line-length
    command = `comm -23 <(seq ${start} ${end}) <(netstat -an -p 'tcp' | grep -v tcp46 | grep tcp4 | awk '{print $4}' | cut -d'.' -f5 | grep -E '[0-9]{1,5}' | sort -un) | head -n ${n}`
  } else {
    throw new Error('unsupported os')
  }

  if (async) {
    return new Promise((resolve, reject) => {
      exec(command, { shell: '/bin/bash' }, (err, stdout, stderror ) => {
        if (err) {
          return reject(err)
        }
        resolve(format(stdout, n))
      })
    })
  } else {
    const stdout = execSync(command, { encoding: 'utf8', shell: '/bin/bash'  })
    return format(stdout, n)
  }

  function format (stdout: string, num: number) {
    const list = stdout.split('\n').map((item) => parseInt(item, 10)).filter((item) => !isNaN(item))
    return num === 1 ? list[0] || null : list.slice(0, num)
  }
}
