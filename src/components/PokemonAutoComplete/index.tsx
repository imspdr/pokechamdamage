import { useEffect, useRef, useState, FC } from 'react';
import { SearchInput, Typography, isKoreanMatch } from '@imspdr/ui';
import { Container, Dropdown, NoResults, OptionItem, OptionsList } from './styled';

export interface PokemonOption {
  label: string;
  value: string;
  aliases?: string[];
}

interface Props {
  options: PokemonOption[];
  onSelect: (option: PokemonOption) => void;
  placeholder?: string;
  className?: string;
  initialValue?: string;
  noResultText?: string;
}

function getLevenshteinDistance(a: string, b: string): number {
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

function isFuzzyMatch(target: string, query: string): boolean {
  if (query.length < 2) return false;
  const normalizedTarget = target.normalize('NFC').toLowerCase();
  const normalizedQuery = query.normalize('NFC').toLowerCase();
  
  if (Math.abs(normalizedTarget.length - normalizedQuery.length) > 2) return false;
  
  const dist = getLevenshteinDistance(normalizedTarget, normalizedQuery);
  if (normalizedTarget.length <= 4) return dist <= 1;
  return dist <= 2;
}

export const PokemonAutoComplete: FC<Props> = ({
  options,
  onSelect,
  placeholder = '포켓몬 검색',
  className,
  initialValue = '',
  noResultText = '검색 결과가 없습니다.',
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) => {
    if (!searchTerm) return true;
    
    const targets = [option.label, ...(option.aliases || [])];
    const cleanQ = searchTerm.replace(/[-\s]/g, '');
    
    // 1. Chosung or Exact inclusion (using @imspdr/ui)
    for (const t of targets) {
      if (isKoreanMatch(t, searchTerm)) return true;
      if (isKoreanMatch(t.replace(/[-\s]/g, ''), cleanQ)) return true;
    }
    
    // 2. Fuzzy match (Typo tolerance)
    for (const t of targets) {
      const cleanT = t.replace(/[-\s]/g, '');
      if (isFuzzyMatch(cleanT, cleanQ)) return true;
    }
    
    return false;
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setIsOpen(true);
  };

  const handleSelect = (option: PokemonOption) => {
    setSearchTerm(option.label);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <Container ref={containerRef} className={className}>
      <SearchInput
        value={searchTerm}
        onChange={(val) => {
          handleSearch(val);
          if (!val) setIsOpen(false);
        }}
        placeholder={placeholder}
      />
      {isOpen && searchTerm && (
        <Dropdown>
          {filteredOptions.length > 0 ? (
            <OptionsList>
              {filteredOptions.map((option) => (
                <OptionItem key={option.value} onClick={() => handleSelect(option)}>
                  <Typography variant="body" level={2}>
                    {option.label}
                  </Typography>
                </OptionItem>
              ))}
            </OptionsList>
          ) : (
            <NoResults>
              <Typography variant="body" level={2}>
                {noResultText}
              </Typography>
            </NoResults>
          )}
        </Dropdown>
      )}
    </Container>
  );
};
