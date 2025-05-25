import * as ScreenOrientation from 'expo-screen-orientation';

export const lockPortrait = async () => {
  try {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  } catch (e) {
    console.warn('Error locking to portrait:', e);
  }
};

export const lockLandscape = async () => {
  try {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
  } catch (e) {
    console.warn('Error locking to landscape:', e);
  }
};

export const unlockOrientation = async () => {
  try {
    await ScreenOrientation.unlockAsync();
  } catch (e) {
    console.warn('Error unlocking orientation:', e);
  }
};
