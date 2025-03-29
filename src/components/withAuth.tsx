import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const withAuth = (WrappedComponent: React.ComponentType) => {
  return function WithAuthComponent(props: any) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "unauthenticated") {
        router.push("/login");
      }
    }, [status, router]);

    if (status === "loading") {
      return <div>Carregando...</div>;
    }

    if (status === "authenticated") {
      return <WrappedComponent {...props} />;
    }

    return null;
  };
};

export default withAuth;