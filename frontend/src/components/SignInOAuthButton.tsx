import { useSignIn } from "@clerk/clerk-react";
import { Button } from "./ui/button";

const SignInOAuthButton = () => {
    const {signIn, isLoaded} = useSignIn();

    if (!isLoaded) {
        return null;
    }

    const signInWithGoogle = async () => {
        signIn.authenticateWithRedirect({
            strategy: "oauth_google",
            redirectUrl: "/sso-callback",
             redirectUrlComplete: "/auth-callback"
        });
    };

    return <Button onClick={signInWithGoogle} variant={"secondary"} className='text-white h-11 w-full border-zinc-200'>
        Sign in with Google
    </Button>
};

export default SignInOAuthButton; 