import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Users, UserMinus, Activity } from "lucide-react";

export default function Dashboard() {
    const [searchParams] = useSearchParams();
    const username = searchParams.get("user") || "Builder";

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header Section */}
                <header className="flex justify-between items-center border-b border-zinc-800 pb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Account Health</h1>
                        <p className="text-zinc-400">Welcome back, <span className="text-blue-400 font-medium">@{username}</span></p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" className="border-zinc-800 text-zinc-300 hover:bg-zinc-900">
                            Settings
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20">
                            <RefreshCw className="mr-2 h-4 w-4" /> Sync Data
                        </Button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Total Followers" value="---" icon={<Users className="w-4 h-4" />} />
                    <StatCard title="Non-Mutuals" value="---" icon={<UserMinus className="w-4 h-4" />} color="text-orange-500" />
                    <StatCard title="Health Score" value="Pending" icon={<Activity className="w-4 h-4" />} color="text-green-500" />
                </div>

                {/* Empty State / Placeholder for List */}
                <Card className="bg-zinc-900 border-zinc-800 border-dashed py-20 text-center">
                    <p className="text-zinc-500">Click "Sync Data" to analyze your X relationships.</p>
                </Card>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color = "text-zinc-100" }: any) {
    return (
        <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider">{title}</CardTitle>
                <div className="text-zinc-500">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className={`text-3xl font-bold ${color}`}>{value}</div>
            </CardContent>
        </Card>
    );
}