export const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

export const generateId = (): string => crypto.randomUUID();

export const isInputElement = (element: EventTarget | null): boolean => {
  if (!(element instanceof HTMLElement)) return false;
  const tag = element.tagName.toLowerCase();
  return tag === 'input' || tag === 'textarea' || element.getAttribute('contenteditable') === 'true';
};
