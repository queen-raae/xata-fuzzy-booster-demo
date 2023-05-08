import React, { useState } from "react";

import { SearchForm, SearchResults } from "../search";

export default function PlainTextPage() {
  const [term, setTerm] = useState("");

  return (
    <main>
      <SearchForm onTermChange={setTerm} term={term} />

      <SearchResults term={term} />
    </main>
  );
}
