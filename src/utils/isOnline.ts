import dns from 'node:dns';

export const isOnline = () => {
  return new Promise((resolve) => {
    dns.lookup('registry.npmjs.org', (error) => {
      if (!error) return resolve(true);
      return resolve(false);
    });
  });
};
