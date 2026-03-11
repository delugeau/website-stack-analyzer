export function decodeUrlParams(url: string): Record<string, string> {
  try {
    const parsed = new URL(url);
    const params: Record<string, string> = {};
    parsed.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  } catch {
    return {};
  }
}

export function decodePostData(postData: string | null): Record<string, string> {
  if (!postData) return {};
  try {
    return JSON.parse(postData);
  } catch {
    // Try URL-encoded form data
    const params: Record<string, string> = {};
    const pairs = postData.split('&');
    for (const pair of pairs) {
      const [key, ...valueParts] = pair.split('=');
      if (key) {
        params[decodeURIComponent(key)] = decodeURIComponent(valueParts.join('=') || '');
      }
    }
    return params;
  }
}
