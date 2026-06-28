const CHOSUNG = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
function isChosung(char) { return CHOSUNG.includes(char); }
function getChosung(char) {
  const code = char.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) {
      const chosungIndex = Math.floor((code - 0xac00) / (21 * 28));
      return CHOSUNG[chosungIndex];
  }
  return char;
}
function getChosungs(str) { return str.split('').map(getChosung).join(''); }
function isKoreanMatch(text, query) {
  if (!query) return true;
  const normalizedText = text.normalize('NFC');
  const normalizedQuery = query.normalize('NFC');
  const isChosungQuery = normalizedQuery.split('').every(isChosung);
  if (isChosungQuery) {
      return getChosungs(normalizedText).includes(normalizedQuery);
  }
  return normalizedText.toLowerCase().includes(normalizedQuery.toLowerCase());
}

function getLevenshteinDistance(a, b) {
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i += 1) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j += 1) {
    for (let i = 1; i <= a.length; i += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // insertion
        matrix[j - 1][i] + 1, // deletion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  return matrix[b.length][a.length];
}

function isFuzzyMatch(target, query) {
  if (query.length < 2) return false;
  const normalizedTarget = target.normalize('NFC').toLowerCase();
  const normalizedQuery = query.normalize('NFC').toLowerCase();
  if (Math.abs(normalizedTarget.length - normalizedQuery.length) > 2) return false;
  const dist = getLevenshteinDistance(normalizedTarget, normalizedQuery);
  if (normalizedTarget.length <= 4) return dist <= 1;
  return dist <= 2;
}

const target = '메가이상해꽃';
const cleanT = target.replace(/[-\s]/g, '');

const tests = [
  { q: 'ㅇㅅㅎㄲ', expected: false }, // ㅇㅅㅎㄲ is not in ㅁㄱㅇㅅㅎㄲ unless it matches inside! Wait! ㅁㄱㅇㅅㅎㄲ includes ㅇㅅㅎㄲ ! So it SHOULD be true!
  { q: 'ㅁㄱㅇㅅㅎㄲ', expected: true },
  { q: '이성해꽃', expected: true }, // typo (but against '메가이상해꽃' it has length diff 4 -> false! but against '이상해꽃' it would be dist 1 -> true)
  { q: '메가이성해꽃', expected: true }, // typo dist 1 against '메가이상해꽃'
  { q: '망나뇽', expected: false },
  { q: '메기이상해꽃', expected: true }, // dist 1 typo
];

for (let t of tests) {
  const cleanQ = t.q.replace(/[-\s]/g, '');
  let match = isKoreanMatch(target, t.q) || isKoreanMatch(cleanT, cleanQ) || isFuzzyMatch(cleanT, cleanQ);
  console.log(t.q, match, "dist:", isFuzzyMatch(cleanT, cleanQ) ? 'fuzzy' : 'not fuzzy');
}

// Test against label "이상해꽃-메가"
const label = "이상해꽃-메가";
console.log("For label 이상해꽃-메가:");
for (let t of [ {q: 'ㅇㅅㅎㄲ'}, {q: '이성해꽃'} ]) {
  const cleanQ = t.q.replace(/[-\s]/g, '');
  let match = isKoreanMatch(label, t.q) || isKoreanMatch(label.replace(/[-\s]/g, ''), cleanQ) || isFuzzyMatch(label.replace(/[-\s]/g, ''), cleanQ);
  console.log(t.q, match);
}

