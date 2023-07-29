import React from "react";

export default function SearchForm({ term, onTermChange, onPrefixChange }) {
  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <label htmlFor="search-field">Search accounts: </label>
      <input
        id="search-field"
        type="search"
        value={term}
        placeholder="Search accounts: name or username"
        onChange={(event) => {
          onTermChange(event.target.value);
        }}
      />
    </form>
  );
}
