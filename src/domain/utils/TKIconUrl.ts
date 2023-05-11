export enum IconPosition {
  MAP,
  INTERFACE
}
export function TKIconUrl(
  name: string,
  mode: IconPosition = IconPosition.INTERFACE
): string {
  if (mode === IconPosition.INTERFACE) {
    return (
      "https://raw.githubusercontent.com/CartONG/opsmap-icons/main/" +
      name +
      ".svg"
    );
  } else {
    return (
      "https://raw.githubusercontent.com/CartONG/opsmap-icons/main/" +
      name +
      ".png"
    );
  }
}
