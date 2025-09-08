import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const BooksContext = createContext(null);

export function BooksProvider({ children }) {
  const [revision, setRevision] = useState(0);
  const lastActionRef = useRef(null);

  const notifyChange = useCallback((action = 'unknown') => {
    lastActionRef.current = { action, at: Date.now() };
    setRevision((x) => x + 1);
  }, []);

  const value = useMemo(() => ({ revision, notifyChange, lastActionRef }), [revision, notifyChange]);

  return (
    <BooksContext.Provider value={value}>{children}</BooksContext.Provider>
  );
}

export const useBooksEvents = () => useContext(BooksContext);
