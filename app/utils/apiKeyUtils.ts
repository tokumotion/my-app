export const maskApiKey = (key: string) => {
  if (key.length <= 10) return key;
  const prefix = key.slice(0, 5);
  const suffix = key.slice(-5);
  return `${prefix}...${suffix}`;
}; 