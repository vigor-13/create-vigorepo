import got from 'got';

export const isExistUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await got.head(url);
    return response.statusCode === 200;
  } catch (error) {
    return false;
  }
};
