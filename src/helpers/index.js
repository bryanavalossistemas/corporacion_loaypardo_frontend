export function formatCurrencyPeru(amount) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(amount);
}

export function formatCurrencyLocale(amount) {
  return amount.toLocaleString("es-PE", {
    style: "currency",
    currency: "PEN",
  });
}

export function now() {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const xd = `${year}-${month < 10 ? `0${month}` : month}-${
    day < 10 ? `0${day}` : day
  }`;
  return xd;
}
