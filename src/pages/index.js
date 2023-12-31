import React, { useState } from "react";

import { SearchForm, SearchResults } from "../search";

export default function PlainTextPage() {
  const [term, setTerm] = useState("css");

  return (
    <main>
      <SearchForm onTermChange={setTerm} term={term} />

      <h2>Baseline</h2>
      <SearchResults term={term} />

      <h2>Boost Username/Name</h2>
      <SearchResults term={term} booster="columns" />

      <h2>Boost Popular</h2>
      <SearchResults term={term} booster="numerical" />

      <h2>Boost Oldtimers</h2>
      <SearchResults term={term} booster="date" />
    </main>
  );
}
