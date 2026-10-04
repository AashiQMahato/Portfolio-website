// Dates in the data files are calendar dates (YYYY-MM-DD). Format them in
// UTC so a visitor west of Greenwich never sees the previous day.
const long = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
const short = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", timeZone: "UTC" });

export const formatDate = (iso) => long.format(new Date(iso));
export const formatMonth = (iso) => short.format(new Date(iso));
