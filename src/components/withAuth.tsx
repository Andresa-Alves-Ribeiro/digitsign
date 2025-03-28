import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface WithAuthOptions {
    redirectTo?: string;
    LoadingComponent?: React.ComponentType;
}

export default function withAuth<P extends object>(
    Component: React.ComponentType<P>,
    options: WithAuthOptions = {}
) {
    const { redirectTo = "/login", LoadingComponent } = options;

    return function AuthenticatedComponent(props: P) {
        const { status } = useSession();
        const router = useRouter();

        useEffect(() => {
            if (status === "unauthenticated") {
                router.push(redirectTo);
            }
        }, [status, router, redirectTo]);

        if (status === "loading") {
            return LoadingComponent ? <LoadingComponent /> : <div>Loading...</div>;
        }

        return <Component {...props} />;
    };
}