async function delay(from: number, ms: number = 0) {
  return await new Promise<void>((resolve) => setTimeout(resolve, from - ms));
}

export { delay };
