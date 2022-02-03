export const isOfType = <T>(varToBeChecked: unknown, ...propertiesToCheck: (keyof T)[]): varToBeChecked is T =>
  !!varToBeChecked && propertiesToCheck.every((prop) => (varToBeChecked as T)[prop] !== undefined);
