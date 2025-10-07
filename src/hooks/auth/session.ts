import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { showMessage } from "@/utils";
import { IRootState } from "@/store";
import { createUserSession } from "@/store/authSlice";
import { setAuthToken } from "@/client/backendClient";
import { LINKS, NOTIFICATION_TITLE } from "@/constants";

export type TUserSession = {
  user: {
    id: number;
    full_name: string;
    email: string;
    contact_number: string;
    phone_code: string;
    address: string;
    last_login_at: string;
    created_at: string;
    timezone: string;
  };
  accessToken: string;
  refreshToken: string;
  client: {
    company_url: string;
    sub_domain: string;
  }
};

export const useSession = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const userSession = useSelector((state: IRootState) => state.auth);
  const [session, setSession] = useState<TUserSession | null>(null);

  useEffect(() => {
    if (userSession?.user) {
      setSession(userSession?.user);
    } else {
      setSession(null);
    }
  }, [userSession, pathname]);

  const setUserSession = (res: TUserSession) => {
    setAuthToken(res.accessToken);
    dispatch(createUserSession(res));
  };

  const updateUserSession = (res: TUserSession) => {
    dispatch(createUserSession(res));
  };

  const logout = (showToast: boolean = true) => {
    setAuthToken("");
    dispatch(createUserSession(null));
    showToast && showMessage(NOTIFICATION_TITLE.LOGGED_OUT);
    router.push(LINKS.login.route);
  };

  return { session, setUserSession, logout, updateUserSession };
};
