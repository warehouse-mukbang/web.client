import { useEffect, useCallback } from 'react';
import { useNavigate } from 'remix';

const useAuthorizer = ({
  platform,
  token,
}: {
  platform: string | null;
  token: string | null;
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (platform && token) {
      window.localStorage.setItem(`WidgetBoard::${platform}`, token);

      navigate('/');
    }
  }, [platform, token]);

  const getPlatform = useCallback(platform => {
    if (!globalThis) {
      return false;
    }

    const token = globalThis?.localStorage?.getItem(`WidgetBoard::${platform}`);

    return token;
  }, []);

  return {
    platform,
    token,

    platforms: {
      github: getPlatform('github'),
    },
  };
};

export default useAuthorizer;
