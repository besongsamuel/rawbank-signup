import { useLocation, useNavigate } from 'react-router-dom';

export function readReturnTo(state: unknown) {
  return (state as { returnTo?: string } | null)?.returnTo === '/account' ? '/account' : undefined;
}

export function useOnboardingNav(previousPath: string, nextPath: string) {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = readReturnTo(location.state);

  const goBack = () => navigate(returnTo ?? previousPath);
  const goNext = () => navigate(returnTo ?? nextPath);

  return { returnTo, goBack, goNext, location };
}
