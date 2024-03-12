import dns from 'node:dns';

export const isOnline = async (): Promise<boolean> => {
  return await new Promise((resolve) => {
    dns.lookup('registry.npmjs.org', (error) => {
      if (error !== null) {
        resolve(false);
        return;
      }
      resolve(true);
    });
  });
};
