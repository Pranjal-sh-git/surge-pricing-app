import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Loader2, X } from 'lucide-react';

// Debounce helper
const useDebounce = (value, delay) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

export const LocationSearchInput = ({
  value,          // current display address string
  placeholder,
  dotColor,       // indicator dot color
  dotShape,       // 'circle' | 'square'
  onSelect,       // (coords: [lat,lng], address: string) => void
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [touched, setTouched] = useState(false); // user started typing

  const debouncedQuery = useDebounce(query, 380);
  const containerRef = useRef(null);

  // Fetch suggestions from Nominatim
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 3) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    setSearching(true);
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(debouncedQuery)}&limit=6&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    )
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        setSuggestions(data.map(p => ({
          display: p.display_name.split(',').slice(0, 3).join(', '),
          lat: parseFloat(p.lat),
          lon: parseFloat(p.lon),
        })));
      })
      .catch(() => { if (!cancelled) setSuggestions([]); })
      .finally(() => { if (!cancelled) setSearching(false); });
    return () => { cancelled = true; };
  }, [debouncedQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
        setTouched(false);
        setQuery('');
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = useCallback((suggestion) => {
    onSelect([suggestion.lat, suggestion.lon], suggestion.display);
    setQuery('');
    setSuggestions([]);
    setIsFocused(false);
    setTouched(false);
  }, [onSelect]);

  const handleClear = (e) => {
    e.stopPropagation();
    setQuery('');
    setSuggestions([]);
    onSelect(null, '');
  };

  const showDropdown = isFocused && touched && (searching || suggestions.length > 0 || (query.length >= 3 && !searching));

  return (
    <div ref={containerRef} className="relative flex items-center gap-3">
      {/* Dot indicator */}
      <div className="w-8 flex justify-center flex-shrink-0 z-10">
        <div
          className={dotShape === 'square' ? 'w-3 h-3 rounded-sm' : 'w-3 h-3 rounded-full border-2 border-[#1DB954]'}
          style={{ background: dotColor }}
        />
      </div>

      {/* Input / display box */}
      <div className="flex-1 min-w-0 relative">
        {isFocused ? (
          /* Typing mode */
          <div className="flex items-center bg-white/10 border border-[#1DB954]/50 rounded-lg px-3 py-2 gap-2">
            {searching
              ? <Loader2 size={14} className="text-[#1DB954] animate-spin flex-shrink-0" />
              : <MapPin size={14} className="text-[#1DB954] flex-shrink-0" />}
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setTouched(true); }}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none font-medium min-w-0"
            />
            {query && (
              <button onClick={() => { setQuery(''); setSuggestions([]); }} className="text-gray-500 hover:text-white flex-shrink-0">
                <X size={12} />
              </button>
            )}
          </div>
        ) : (
          /* Display mode — click to edit */
          <button
            onClick={() => setIsFocused(true)}
            className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 text-sm transition-all duration-150 flex items-center gap-2 group"
          >
            <span className={`flex-1 truncate min-w-0 ${value ? 'text-white font-medium' : 'text-gray-500 italic'}`}>
              {value || placeholder}
            </span>
            {value && (
              <button
                onClick={handleClear}
                className="text-gray-600 hover:text-white flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={11} />
              </button>
            )}
          </button>
        )}

        {/* Dropdown suggestions */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-[2000] overflow-hidden">
            {searching && suggestions.length === 0 && (
              <div className="px-4 py-3 text-xs text-gray-500 flex items-center gap-2">
                <Loader2 size={12} className="animate-spin text-[#1DB954]" />
                Searching…
              </div>
            )}
            {!searching && suggestions.length === 0 && query.length >= 3 && (
              <div className="px-4 py-3 text-xs text-gray-500">No results for "{query}"</div>
            )}
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSelect(s)}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-start gap-3 transition-colors border-b border-white/5 last:border-0"
              >
                <MapPin size={13} className="text-[#1DB954] flex-shrink-0 mt-0.5" />
                <span className="truncate leading-snug">{s.display}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
