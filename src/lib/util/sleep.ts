export default function sleep(ms: number = 600) {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => resolve(true), ms);
  });
}
