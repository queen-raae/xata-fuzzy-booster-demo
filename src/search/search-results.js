import React from "react";
import axios from "axios";
import { useDebounce } from "usehooks-ts";
import { useQuery } from "@tanstack/react-query";

const search = async ({ term, booster }) => {
  const endpoint = booster ? `/api/fuzzy/${booster}` : "/api/fuzzy";
  return await axios.get(endpoint, {
    params: { term: term, booster: booster },
  });
};

export default function SearchResults({ term, booster }) {
  const debouncedTerm = useDebounce(term, 500);

  const query = useQuery({
    queryKey: ["search", booster, debouncedTerm],
    queryFn: async () => {
      if (!debouncedTerm) return { data: [] };
      return await search({ term: debouncedTerm, booster: booster });
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

      {(results || []).map(({ record, highlight, score }) => {
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
                  __html: highlight?.description || record.description,
                }}
              />
              {record.meta.location && (
                <p>
                  <strong>Location: </strong>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: highlight?.location || record.location,
                    }}
                  />
                </p>
              )}
              <hr />
              <p>
                <strong>Followers: </strong>
                <span>{record.followers_count.toLocaleString("en")}</span>
                <br />
                <strong>On Twitter since: </strong>
                <span>{new Date(record.created_at).toDateString()}</span>
                <br />
                <strong>Score: </strong>
                <span>{score.toLocaleString("en")}</span>
              </p>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
