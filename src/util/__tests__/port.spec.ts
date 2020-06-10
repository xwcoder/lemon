import { getAvailablePort, getAvailablePortSync } from '../port';

describe('port/getAvailablePort', () => {
  it('should get n port async', async () => {
    const port = await getAvailablePort();

    expect(typeof port).toEqual('number');

    const ports = await getAvailablePort({ n: 3 });
    expect(ports).toHaveLength(3);
  });

  it('should get n port between 5000 and 6000 async', async () => {
    const port = await getAvailablePort({
      start: 5000,
      end: 6000,
    });

    expect(port).toBeLessThanOrEqual(6000);
    expect(port >= 5000).toBeTruthy();

    const ports = await getAvailablePort({
      n: 3,
      start: 5000,
      end: 6000,
    });

    expect(ports).toHaveLength(3);
    (ports as number[]).forEach((item) => {
      expect(item).toBeLessThanOrEqual(6000);
      expect(item >= 5000).toBeTruthy();
    });
  });
});

describe('port/getAvailablePortSync', () => {
  it('should get n port sync', () => {
    const port = getAvailablePortSync();

    expect(typeof port).toEqual('number');

    const ports = getAvailablePortSync({ n: 3 });
    expect(ports).toHaveLength(3);
  });

  it('should get n port between 5000 and 6000 sync', () => {
    const port = getAvailablePortSync({ start: 5000, end: 6000 });

    expect(port).toBeLessThanOrEqual(6000);
    expect(port >= 5000).toBeTruthy();

    const ports = getAvailablePortSync({ n: 3, start: 5000, end: 6000 });

    expect(ports).toHaveLength(3);
    (ports as number[]).forEach((item) => {
      expect(item).toBeLessThanOrEqual(6000);
      expect(item >= 5000).toBeTruthy();
    });
  });
});
