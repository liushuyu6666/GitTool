export default function(container: Record<any, any []>, key: any, val: any): void {
  if (!Object.keys(container).includes(key)) {
    container[key] = [];
  }
  container[key].push(val);
}