export const bn = (value: number, fractionDigits = 0): string =>
  value.toLocaleString("bn-BD", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

export const bnDate = (): string =>
  new Date().toLocaleDateString("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const unitLabel = (unit: string): string => {
  const labels: Record<string, string> = {
    kg: "কেজি",
    ltr: "লিটার",
    liter: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
    pc: "পিস",
    bottle: "বোতল",
    bundle: "আঁটি",
  };

  return labels[unit.toLowerCase()] ?? unit;
};
