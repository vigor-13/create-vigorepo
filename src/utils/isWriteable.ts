import { access, constants } from 'fs-extra';

export const isWriteable = async (directory: string): Promise<boolean> => {
  try {
    await access(directory, constants.W_OK);
    return true;
  } catch (error) {
    return false;
  }
};
