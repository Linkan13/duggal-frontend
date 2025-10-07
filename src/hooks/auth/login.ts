import { useMutation } from "react-query";
import { useRouter } from "next/navigation";
import { showMessage } from "@/utils";
import { loginRequest } from "@/client/endpoints";
import { LINKS } from "@/constants";
import { useSession } from "@/hooks";

export const useLogin = () => {
  const router = useRouter();
  const { setUserSession } = useSession();

  return useMutation(loginRequest, {
    onSuccess: (res) => {
      setUserSession(res?.data?.data);
      showMessage(res.data.message)
      router.push(LINKS.dashboard.route);
    },
  });
};
