export default function normalizePrice(value) {
  if (value > 0) {
    return value;
  }
  return 0;
}
