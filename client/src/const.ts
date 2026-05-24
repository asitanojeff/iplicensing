export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

const FALLBACK_LOGIN_URL = "/";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL?.trim() ?? "";
  const appId = import.meta.env.VITE_APP_ID?.trim() ?? "";

  if (!oauthPortalUrl || !appId) {
    return FALLBACK_LOGIN_URL;
  }

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  let url: URL;
  try {
    url = new URL("app-auth", oauthPortalUrl.endsWith("/") ? oauthPortalUrl : `${oauthPortalUrl}/`);
  } catch {
    return FALLBACK_LOGIN_URL;
  }

  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
