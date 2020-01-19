import { getAvailablePort } from '../port'

describe('port/getAvailablePort', () => {

  it('should get n port sync', () => {

    const port = getAvailablePort()

    expect(typeof port).toEqual('number')

    const ports = getAvailablePort({ n: 3 })
    expect(ports).toHaveLength(3)

  })

  it('should get n port between 5000 and 6000 sync', () => {

    const port = getAvailablePort({ start: 5000, end: 6000 })

    expect(port).toBeLessThanOrEqual(6000)
    expect(port >= 5000).toBeTruthy()

    const ports = getAvailablePort({ n: 3, start: 5000, end: 6000 })

    expect(ports).toHaveLength(3);
    (ports as number[]).forEach((item) => {
      expect(item).toBeLessThanOrEqual(6000)
      expect(item >= 5000).toBeTruthy()
    })
  })

  it('should get n port async', async () => {

    const port = await getAvailablePort({ async: true })

    expect(typeof port).toEqual('number')

    const ports = await getAvailablePort({ n: 3, async: true })
    expect(ports).toHaveLength(3)

  })

  it('should get n port between 5000 and 6000 async', async () => {

    const port = await getAvailablePort({ start: 5000, end: 6000, async: true })

    expect(port).toBeLessThanOrEqual(6000)
    expect(port >= 5000).toBeTruthy()

    const ports = await getAvailablePort({ n: 3, start: 5000, end: 6000, async: true })

    expect(ports).toHaveLength(3);
    (ports as number[]).forEach((item) => {
      expect(item).toBeLessThanOrEqual(6000)
      expect(item >= 5000).toBeTruthy()
    })
  })
})
