export const testCases = [
  {
    name: "List All Blocked Countries - India should be listed as blocked",
    query: "List all currently blocked countries for this website",
    expectedTexts: ["India"],
  },
  {
    name: "Block Country - Add Pakistan to the blocked list",
    query:
      "Add to the blocked countries list Pakistan, so I don't have any visitors from there. Proceed directly with the request and do not ask for confirmation.",
    expectedTexts: ["Pakistan", "successfully"],
  },
  {
    name: "Delete Blocked Country - Remove Bolivia from the blocked list",
    query: "Remove Bolivia from the blocked countries list for this website",
    expectedTexts: ["Bolivia", "successfully"],
  },
  {
    name: "Cache Purge - Purge cache for the website",
    query: "Purge the cache for this website",
    expectedTexts: ["purged", "successfully"],
  },
  {
    name: "Enable Memcached",
    query: "Get memcached user service activated for this website",
    expectedTexts: ["Memcached", "successfully"],
  },
  {
    name: "Enable free CDN service",
    query: "Enable the free CDN service for this website",
    expectedTexts: ["CDN", "enabled"],
  },
  {
    name: "List WordPress Apps",
    query: "List all wordpress apps for this account",
    expectedTexts: ["no", "WordPress"],
  },
];
