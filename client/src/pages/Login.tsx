import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutGrid, TrendingUp, Users, Shield } from "lucide-react";

export default function LoginPage() {
    const handleLogin = () => {
        window.location.href = "http://127.0.0.1:5000/api/auth/x";
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-4 font-sans">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl animate-pulse" />
                <div className="absolute -bottom-1/4 -right-1/4 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl animate-pulse delay-1000" />
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute h-1 w-1 rounded-full bg-white/20"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `float ${5 + Math.random() * 10}s linear infinite`,
                            animationDelay: `${Math.random() * 5}s`,
                        }}
                    />
                ))}
            </div>

            <Card className="relative w-full max-w-md overflow-hidden border-zinc-800/50 bg-zinc-900/50 backdrop-blur-xl shadow-2xl">
                {/* Gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                <CardHeader className="space-y-1 pb-6 text-center relative">
                    <div className="flex justify-center mb-4">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-xl bg-blue-600 blur-lg opacity-50 animate-pulse" />
                            <div className="relative rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-3 shadow-lg">
                                <LayoutGrid className="h-8 w-8 text-white" />
                            </div>
                        </div>
                    </div>

                    <CardTitle className="text-3xl font-bold tracking-tight text-white">
                        X Relationship
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            Analyzer
                        </span>
                    </CardTitle>

                    <CardDescription className="text-zinc-400 mt-2 max-w-sm mx-auto">
                        Audit your network. Clean your feed. Grow with intent.
                    </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-6 relative">
                    {/* Feature highlights */}
                    <div className="grid grid-cols-3 gap-2 mb-2">
                        <div className="text-center p-2 rounded-lg bg-zinc-800/30">
                            <Users className="h-4 w-4 text-blue-400 mx-auto mb-1" />
                            <span className="text-xs text-zinc-400">Audience</span>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-zinc-800/30">
                            <TrendingUp className="h-4 w-4 text-purple-400 mx-auto mb-1" />
                            <span className="text-xs text-zinc-400">Growth</span>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-zinc-800/30">
                            <Shield className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
                            <span className="text-xs text-zinc-400">Privacy</span>
                        </div>
                    </div>

                    <Button
                        onClick={handleLogin}
                        className="group relative w-full h-12 text-lg font-semibold overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-black via-zinc-800 to-black group-hover:from-zinc-800 group-hover:via-zinc-700 group-hover:to-zinc-800 transition-all duration-300" />
                        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700" />
                        <span className="relative flex items-center justify-center text-white">
                            <XIcon className="mr-2 h-5 w-5" />
                            Sign in with X
                        </span>
                    </Button>

                    <div className="space-y-2 text-center">
                        <p className="text-xs text-zinc-500 leading-relaxed">
                            By clicking continue, you agree to our{' '}
                            <button className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors">
                                Terms of Service
                            </button>{' '}
                            and the{' '}
                            <button className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors">
                                X Developer API policies
                            </button>
                            .
                        </p>

                        <div className="flex items-center justify-center gap-2 pt-2">
                            <div className="h-px w-8 bg-gradient-to-r from-transparent to-zinc-700" />
                            <span className="text-xs text-zinc-600">secure connection</span>
                            <div className="h-px w-8 bg-gradient-to-l from-transparent to-zinc-700" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <style jsx>{`
                @keyframes float {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.486 3.24H4.298l13.309 17.41z" />
        </svg>
    );
}