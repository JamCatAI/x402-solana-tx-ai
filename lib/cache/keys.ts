export const cacheKeys = {
  facts: (network: string, signature: string) => `facts:${network}:${signature}`,
  ai: (network: string, signature: string, mode: string, modelVersion: string) =>
    `ai:${network}:${signature}:${mode}:${modelVersion}`
};
