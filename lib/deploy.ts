// Store deploy ID in localStorage
const DEPLOY_ID_KEY = 'netlify_deploy_id';

export function getDeployId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(DEPLOY_ID_KEY);
}

export function setDeployId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DEPLOY_ID_KEY, id);
}