type AukioloAjat = {
  paivat: string[];
  aika: { aukeaa?: string | number; sulkeutuu?: string | number };
};

const fullWeek = ["ma", "ti", "ke", "to", "pe", "la", "su"];

//Tähän voi määrätä aukiolopäivät ja niiden ajat
const input: AukioloAjat[] = [
  { paivat: ["ma", "ti", "ke", "pe"], aika: { aukeaa: "8", sulkeutuu: "16" } },
  { paivat: ["to"], aika: { aukeaa: 10, sulkeutuu: 14 } },
  { paivat: ["la", "su"], aika: {} },
];

//Näyttää ajan xx:xx muodossa, vaikka aika olisi annettuna normaalina kokonaislukuna
function normalizeTime(v?: string | number): string {
  if (v == null) return "";
  const s = String(v);
  if (/^\d{1,2}:\d{2}$/.test(s)) return s;
  if (/^\d{1,2}$/.test(s)) return s.padStart(2, "0") + ":00";
  return s;
}

//Asettaa väliviivan aukeamis- ja sulkeutumisajan välille näyttääkseen aikaväliltä
function formatTime(aika: AukioloAjat["aika"]): string {
  const open = normalizeTime(aika.aukeaa);
  const close = normalizeTime(aika.sulkeutuu);
  return !open && !close ? "24/7" : `${open}${open || close ? " - " : ""}${close}`;
}

//Muuttaa päivien lyhenteiden ensimmäisen kirjaimen isoksi säännöllisyyden vuoksi
function formatRange(indexes: number[]): string {
  const names = indexes.map((i) =>
    fullWeek[i].charAt(0).toUpperCase() + fullWeek[i].slice(1)
  );
  return names.length === 1
    ? names[0]
    : `${names[0]}-${names[names.length - 1]}`;
}

//Näyttää peräkkäiset päivät väliviivalla erotettuna, sekä ei-perättäiset päivät, joilla on samat aukioloajat pilkulla erotettuna
function groupConsecutiveDays(days: string[]): string {
  const idxs = days
    .map((d) => fullWeek.indexOf(d))
    .filter((i) => i !== -1)
    .sort((a, b) => a - b);

  const result: string[] = [];
  let temp = [idxs[0]];

  for (let i = 1; i < idxs.length; i++) {
    const curr = idxs[i],
      prev = idxs[i - 1];
    if (curr === prev + 1) temp.push(curr);
    else {
      result.push(formatRange(temp));
      temp = [curr];
    }
  }
  if (temp.length) result.push(formatRange(temp));

  return result.join(", ");
}

//Järjestää päivät aukioloaikojen mukaan
export function groupDaysByTime(entries: AukioloAjat[]): string[] {
  const map = new Map<string, string[]>();

  for (const entry of entries) {
    const timeStr = formatTime(entry.aika);
    for (const d of entry.paivat) {
      const arr = map.get(timeStr) ?? [];
      arr.push(d);
      map.set(timeStr, arr);
    }
  }

  return Array.from(map.entries()).map(([time, days]) => {
    const uniq = Array.from(new Set(days));
    const dayGroups = groupConsecutiveDays(uniq);
    return `${dayGroups}: ${time}`;
  });
}


const svelteWeekIndex = [6, 0, 1, 2, 3, 4, 5]; 

//Selvittää aukioloajan tämänhetkiselle päivälle
export function getTodayOpeningTime(entries: AukioloAjat[] = input): string {
  const todayCode = new Date().getDay();
  const today = fullWeek[svelteWeekIndex[todayCode]];

  for (const entry of entries) {
    if (entry.paivat.includes(today)) {
      const { aukeaa, sulkeutuu } = entry.aika;
      return aukeaa == null && sulkeutuu == null
        ? "Kiinni"
        : formatTime(entry.aika);
    }
  }
  return "Kiinni";
}


export const ajat: string[] = groupDaysByTime(input);
