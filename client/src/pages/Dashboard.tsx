import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    RefreshCw, Users, UserMinus, UserCheck, Loader2, UserX,
    TrendingUp, ArrowUpRight, Clock, Shield, Zap, Sparkles
} from "lucide-react";

interface SyncData {
    totalFollowing: number;
    totalFollowers: number;
    nonMutualCount: number;
    nonMutuals: Array<{ id: string; name: string; username: string }>;
}

export default function Dashboard() {
    const [searchParams] = useSearchParams();
    const username = searchParams.get("user") || "Builder";

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<SyncData | null>(null);

    const handleSync = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("http://localhost:5000/api/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to sync data.");
            }

            setData(result);
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate health score if data exists
    const healthScore = data ? Math.round((data.totalFollowers / data.totalFollowing) * 100) : 0;
    const healthScoreColor = healthScore >= 90 ? "text-emerald-400" : healthScore >= 70 ? "text-yellow-400" : "text-red-400";

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100 p-8 font-sans">
            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-600/5 blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-600/5 blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative max-w-6xl mx-auto space-y-8">
                {/* Header Section with Gradient */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-8">
                    <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />

                    <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-8 w-1 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full" />
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                                    Account Health
                                </h1>
                            </div>
                            <div className="flex items-center gap-2 text-zinc-400">
                                <span>Welcome back,</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-medium">
                                    @{username}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700">
                                    active now
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300"
                            >
                                <Clock className="mr-2 h-4 w-4" />
                                Last 30 days
                            </Button>
                            <Button
                                onClick={handleSync}
                                disabled={isLoading}
                                className="relative overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-900/20 disabled:opacity-50"
                            >
                                <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <RefreshCw className="mr-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                                )}
                                {isLoading ? "Syncing..." : "Sync Data"}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="group relative overflow-hidden rounded-lg bg-red-900/20 border border-red-500/50 p-4 animate-shake">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent" />
                        <p className="relative text-red-200 flex items-center">
                            <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse" />
                            Error: {error}
                        </p>
                    </div>
                )}

                {/* Health Score Card */}
                {data && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="md:col-span-1 bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800 overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-zinc-400">Health Score</span>
                                    <TrendingUp className="w-4 h-4 text-zinc-500" />
                                </div>
                                <div className="flex items-end gap-2">
                                    <span className={`text-4xl font-bold ${healthScoreColor}`}>{healthScore}%</span>
                                    <span className="text-xs text-zinc-500 mb-1">/100</span>
                                </div>
                                <div className="mt-4 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${healthScore >= 90 ? "bg-emerald-500" :
                                                healthScore >= 70 ? "bg-yellow-500" : "bg-red-500"
                                            }`}
                                        style={{ width: `${healthScore}%` }}
                                    />
                                </div>
                                <p className="mt-4 text-xs text-zinc-500">
                                    {healthScore >= 90 ? "Excellent engagement!" :
                                        healthScore >= 70 ? "Good, but room for improvement" :
                                            "Needs attention"}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Stats Cards */}
                        <StatCard
                            title="Following"
                            value={data.totalFollowing}
                            icon={<UserCheck className="w-4 h-4" />}
                            trend="+2.5%"
                            color="from-blue-500/20 to-blue-600/20"
                        />
                        <StatCard
                            title="Followers"
                            value={data.totalFollowers}
                            icon={<Users className="w-4 h-4" />}
                            trend="+5.2%"
                            color="from-purple-500/20 to-purple-600/20"
                        />
                        <StatCard
                            title="Non-Mutuals"
                            value={data.nonMutualCount}
                            icon={<UserMinus className="w-4 h-4" />}
                            trend="-3.1%"
                            trendDirection="down"
                            color="from-orange-500/20 to-red-600/20"
                        />
                    </div>
                )}

                {/* Data List Section */}
                <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-500" />
                            Requires Attention
                            {data && data.nonMutualCount > 0 && (
                                <span className="text-sm px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                                    {data.nonMutualCount} accounts
                                </span>
                            )}
                        </h2>

                        {data && data.nonMutualCount > 0 && (
                            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                                View all
                                <ArrowUpRight className="ml-1 w-3 h-3" />
                            </Button>
                        )}
                    </div>

                    {!data && !isLoading && (
                        <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800 border-dashed py-20 text-center group hover:border-blue-500/50 transition-colors cursor-pointer" onClick={handleSync}>
                            <CardContent>
                                <div className="flex flex-col items-center gap-4">
                                    <div className="p-4 rounded-full bg-zinc-800 group-hover:bg-zinc-700 transition-colors">
                                        <Zap className="w-8 h-8 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                                    </div>
                                    <p className="text-zinc-400">Click to analyze your X relationships</p>
                                    <Button variant="outline" className="border-zinc-700">
                                        Start Analysis
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {data && data.nonMutuals.length === 0 && (
                        <Card className="bg-gradient-to-br from-emerald-900/20 to-zinc-900 border-emerald-500/20 py-12 text-center">
                            <CardContent>
                                <div className="flex flex-col items-center gap-3">
                                    <div className="p-3 rounded-full bg-emerald-500/20">
                                        <UserCheck className="w-8 h-8 text-emerald-400" />
                                    </div>
                                    <p className="text-emerald-400 font-medium text-lg">Perfect engagement score!</p>
                                    <p className="text-zinc-500 text-sm">Everyone you follow follows you back.</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {data && data.nonMutuals.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {data.nonMutuals.map((user, index) => (
                                <Card
                                    key={user.id}
                                    className="group bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/10 animate-in fade-in slide-in-from-bottom-4"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <CardContent className="flex items-center justify-between p-4">
                                        <div className="truncate pr-4">
                                            <p className="font-medium text-zinc-200 group-hover:text-white transition-colors truncate">
                                                {user.name}
                                            </p>
                                            <a
                                                href={`https://x.com/${user.username}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-sm text-zinc-500 hover:text-blue-400 transition-colors truncate inline-flex items-center gap-1 group/link"
                                            >
                                                @{user.username}
                                                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                                                not following
                                            </span>
                                            <UserX className="text-zinc-600 group-hover:text-red-400 w-5 h-5 flex-shrink-0 transition-colors" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer with quick stats */}
                {data && (
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-800 text-xs text-zinc-600">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                <span>Data encrypted</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>Last sync: Just now</span>
                            </div>
                        </div>
                        <span>Updated in real-time</span>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
                    20%, 40%, 60%, 80% { transform: translateX(2px); }
                }
                .animate-shake {
                    animation: shake 0.8s ease-in-out;
                }
                .bg-grid-white {
                    background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                                      linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                    background-size: 20px 20px;
                }
            `}</style>
        </div>
    );
}

// Enhanced Stat Card Component
function StatCard({ title, value, icon, trend, trendDirection = "up", color = "from-blue-500/20 to-purple-500/20" }: any) {
    return (
        <Card className="relative overflow-hidden group bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800 hover:border-zinc-700 transition-all duration-300">
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                    {title}
                </CardTitle>
                <div className="text-zinc-500 group-hover:text-zinc-300 transition-colors">
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-end justify-between">
                    <div>
                        <div className="text-3xl font-bold text-white group-hover:scale-105 transition-transform duration-300">
                            {value}
                        </div>
                        {trend && (
                            <div className={`flex items-center gap-1 mt-1 text-xs ${trendDirection === "up" ? "text-emerald-400" : "text-red-400"
                                }`}>
                                {trendDirection === "up" ? "↑" : "↓"} {trend}
                                <span className="text-zinc-600">vs last month</span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}