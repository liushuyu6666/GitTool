export default function(str: string) {
  const regex = new RegExp('^[0-9a-f]{2}$');
  return str.match(regex);
}