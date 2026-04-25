export async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  message = "Timed out"
): Promise<T> {
  const controller = new AbortController();

  const timeout = setTimeout(() => controller.abort(message), ms);
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        controller.signal.addEventListener("abort", () => {
          reject(new Error(message));
        });
      }),
    ]);
  } finally {
    clearTimeout(timeout);
  }
}
