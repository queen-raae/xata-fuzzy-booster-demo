import React, { useState } from "react";

import { SearchForm, SearchResults } from "../search";

export default function PlainTextPage() {
  const [term, setTerm] = useState("css");

  return (
    <main>
      <SearchForm onTermChange={setTerm} term={term} />

      <h2>Baseline</h2>
      <SearchResults term={term} />
    </main>
  );
}
