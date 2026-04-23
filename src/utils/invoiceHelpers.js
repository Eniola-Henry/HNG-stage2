
export const generateInvoiceId = () => {
  const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const letters = ALPHA[Math.floor(Math.random() * 26)] + ALPHA[Math.floor(Math.random() * 26)];
  const digits  = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return letters + digits;
};

export const addDaysToDate = (dateStr, days) => {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + Number(days));
  return d.toISOString().split("T")[0];
};

export const calcInvoiceTotal = (items = []) =>
  items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0), 0);


export const hydrateItems = (items = []) =>
  items.map((item) => ({
    ...item,
    total: (Number(item.quantity) || 0) * (Number(item.price) || 0),
  }));

export const todayISO = () => new Date().toISOString().split("T")[0];
