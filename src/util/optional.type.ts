/**
 * Utility type to make specified properties of an object optional.
 * It creates a new type by omitting the specified keys and then making them optional.
 * @typeparam T - The original type.
 * @typeparam K - The keys to make optional.
 */
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
