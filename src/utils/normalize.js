export function normalizeName(n) {
  if (!n) return "";
  if (typeof n === "string") {
    const s = n.trim();
    if ((s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']'))) {
      try {
        const parsed = JSON.parse(s);
        return normalizeName(parsed);
      } catch (e) {
        // not valid JSON, return raw string
      }
    }
    return s;
  }
  if (typeof n === "object") {
    if (n.displayName) return String(n.displayName).trim();
    if (n.fullName) return String(n.fullName).trim();
    const parts = [];
    if (n.firstName) parts.push(n.firstName);
    if (n.first) parts.push(n.first);
    if (n.lastName) parts.push(n.last);
    if (n.lastName) parts.push(n.lastName);
    const otherStrings = Object.values(n).filter(v => typeof v === 'string');
    for (const s of otherStrings) parts.push(s);
    const seen = new Set();
    const out = [];
    for (let p of parts) {
      if (!p) continue;
      p = String(p).trim();
      if (!p) continue;
      if (!seen.has(p)) { seen.add(p); out.push(p); }
    }
    return out.join(' ');
  }
  return String(n);
}

export function normalizeLocation(l) {
  if (!l) return "";
  if (typeof l === "string") {
    const s = l.trim();
    if ((s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']'))) {
      try {
        const parsed = JSON.parse(s);
        return normalizeLocation(parsed);
      } catch (e) {
        // not JSON, return raw string
      }
    }
    return s;
  }
  if (typeof l === "object") {
    // Common address fields
    const parts = [];
    if (l.address) parts.push(l.address);
    if (l.street) parts.push(l.street);
    if (l.city) parts.push(l.city);
    if (l.state) parts.push(l.state);
    if (l.country) parts.push(l.country);
    if (l.zip) parts.push(l.zip);
    const otherStrings = Object.values(l).filter(v => typeof v === 'string');
    for (const s of otherStrings) parts.push(s);
    const seen = new Set();
    const out = [];
    for (let p of parts) {
      if (!p) continue;
      p = String(p).trim();
      if (!p) continue;
      if (!seen.has(p)) { seen.add(p); out.push(p); }
    }
    return out.join(', ');
  }
  return String(l);
}
