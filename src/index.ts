import { KeyboardController } from './controller';

const waitForPlayer = async (interval: number, timeout: number) => {
  let loopID: number;
  const waiter = new Promise<true>((resolve) => {
    loopID = setInterval(() => {
      if (window.player && document.querySelector('video')) {
        clearInterval(loopID);
        resolve(true);
        return;
      }
    }, interval);
  });
  const timer = new Promise<false>((resolve) =>
    setTimeout(() => {
      clearInterval(loopID);
      resolve(false);
    }, timeout)
  );
  return Promise.race([waiter, timer]);
};

const main = async () => {
  const found = await waitForPlayer(500, 10000);
  if (!found) {
    console.error('failed to start dazn keyboard controller');
    return;
  }

  new KeyboardController(window.player, window.document);
};

main();
