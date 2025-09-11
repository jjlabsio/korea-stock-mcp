// Date → YYYYMMDD
function format(date: Date): string {
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}

// UTC 날짜
function getTodayUtc(): string {
  return format(new Date());
}

// KST 날짜 (UTC + 9시간)
function getTodayKst(): string {
  const utc = new Date();
  const kstTime = new Date(utc.getTime() + 9 * 60 * 60 * 1000);
  return format(kstTime);
}

export function getToday() {
  const response = {
    todayKST: getTodayKst(),
    todayUTC: getTodayUtc(),
  };

  return response;
}
