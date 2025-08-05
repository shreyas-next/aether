import Container from "@/components/global/container";
import Icons from "@/components/global/icons";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const Home = async () => {

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        return (
            <div className="flex items-center justify-center w-full h-screen">
                <Container animation="fadeUp">
                    <div className="flex flex-col items-center max-w-xl px-2 mx-auto sm:px-0">
                        <Icons.icon className="size-12" />
                        <h1 className="text-3xl font-medium text-center mt-6">
                            Welcome back! Let's build
                        </h1>
                        <p className="w-full mt-4 text-center text-muted-foreground text-balance">
                            Aether is your creative companion, effortlessly generating content, diagrams, and images
                        </p>
                        <Link href="/dashboard" className={buttonVariants({ className: "mt-6" })}>
                            Get Started
                            <ArrowRightIcon className="w-4 h-4 ml-1.5" />
                        </Link>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <Container animation="fadeUp">
                <div className="flex flex-col items-center max-w-xl px-2 mx-auto sm:px-0">
                    <Icons.icon className="size-12" />
                    <h1 className="mt-6 text-3xl font-medium text-center">
                        The intelligent AI companion
                    </h1>
                    <p className="w-full mt-4 text-center text-muted-foreground text-balance">
                        Aether is your creative companion, effortlessly generating content, diagrams, and images
                    </p>
                    <Link href="/auth/signin" className={buttonVariants({ className: "mt-6" })}>
                        Start creating
                        <ArrowRightIcon className="w-4 h-4 ml-1.5" />
                    </Link>
                </div>
            </Container>
        </div>
    )
};

export default Home
