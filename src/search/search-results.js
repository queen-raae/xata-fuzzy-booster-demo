import React from "react";
import axios from "axios";
import { useDebounce } from "usehooks-ts";
import { useQuery } from "@tanstack/react-query";

const search = async ({ term }) => {
  return await axios.get(`/api/fuzzy`, {
    params: { term: term },
  });
};

export default function SearchResults({ term }) {
  const debouncedTerm = useDebounce(term, 500);

  const query = useQuery({
    queryKey: ["search", debouncedTerm],
    queryFn: async () => {
      if (!debouncedTerm) return { data: [] };
      return await search({ term: debouncedTerm });
    },
    select: (response) => response.data,
    keepPreviousData: true,
    staleTime: Infinity,
  });

  const { data: results, isSuccess, isFetching } = query;

  return (
    <ul className={isFetching ? "loading" : ""}>
      {isSuccess && results.length === 0 && (
        <li key="empty">
          <p>No results</p>
        </li>
      )}

      {(results || []).map(({ record, highlight }) => {
        return (
          <li key={record.username}>
            <a href={`http://twitter.com/${record.username}`}>
              <img
                src={record.meta.profile_image_url}
                aria-hidden={true}
                alt={`Avatar for ${record.username}`}
              />
              <span
                dangerouslySetInnerHTML={{
                  __html: highlight?.name || record.name,
                }}
              />
              <br />
              @
              <span
                dangerouslySetInnerHTML={{
                  __html: highlight?.username || record.username,
                }}
              />
              <hr />
              <p
                dangerouslySetInnerHTML={{
                  __html:
                    highlight?.meta?.description || record.meta.description,
                }}
              />
              {record.meta.location && (
                <p>
                  <strong>Location: </strong>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: highlight?.meta?.location || record.meta.location,
                    }}
                  />
                </p>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
