export function logWithIcon(icon: string, color: string, message: string) {
  console.log(`\x1b[${color}m${icon} ${message}\x1b[0m`);
}
