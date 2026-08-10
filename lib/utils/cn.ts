type ClassValue = string | false | null | undefined;

export function cn(...classNames: ClassValue[]): string {
  return classNames.filter(Boolean).join(" ");
}
