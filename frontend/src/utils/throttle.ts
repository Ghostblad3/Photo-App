function throttle(mainFunction: () => void, delay: number) {
  let allow: boolean = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return () => {
    if (!allow) {
      allow = true;
      mainFunction();

      setTimeout(() => {
        allow = false; // Clear the timerFlag to allow the main function to be executed again
      }, delay);
    }
  };
}

export { throttle };
