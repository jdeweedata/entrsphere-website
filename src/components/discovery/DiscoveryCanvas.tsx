"use client";

import { useMemo } from "react";
import { ChatMessage, DiscoveryRoute, ROUTES } from "@/types/discovery";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    CheckCircle,
    Circle,
    Clock,
    Database,
    Lightbulb,
    Question
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface DiscoveryCanvasProps {
    messages: ChatMessage[];
    route: DiscoveryRoute | null;
    generatedSpec: object | null;
    isGeneratingSpec: boolean;
}

export default function DiscoveryCanvas({
    messages,
    route,
    generatedSpec,
    isGeneratingSpec
}: DiscoveryCanvasProps) {

    // Heuristic: Extract Q&A pairs
    // Assumes Assistant asks -> User answers.
    const qaPairs = useMemo(() => {
        const pairs: { question: string; answer: string; id: string }[] = [];

        for (let i = 0; i < messages.length - 1; i++) {
            const msg = messages[i];
            const nextMsg = messages[i + 1];

            // Simple heuristic: If AI speaks, and next is User, match them.
            // We could refine this by looking for '?' in AI message.
            if (msg.role === 'assistant' && nextMsg.role === 'user') {
                // Clean up the question text (take last paragraph or sentence usually containing the question)
                // For now, we take a snippet.
                let qText = msg.content;
                if (qText.length > 150) qText = qText.substring(0, 150) + "...";

                pairs.push({
                    id: msg.id,
                    question: qText,
                    answer: nextMsg.content
                });
            }
        }
        return pairs.reverse(); // Newest first
    }, [messages]);

    // Insights / Key Fields (Placeholder logic until AI extraction is added)
    const insights = useMemo(() => {
        const list = [];
        if (route) list.push({ label: "Route", value: ROUTES[route].name });
        if (messages.length > 5) list.push({ label: "Engagement", value: "High" });
        if (generatedSpec) list.push({ label: "Status", value: "Spec Ready" });
        return list;
    }, [route, messages, generatedSpec]);

    return (
        <div className="h-full flex flex-col bg-slate-50 shadow-xl shadow-slate-200/50">

            {/* Header */}
            <div className="p-4 border-b border-slate-200 bg-white/50 backdrop-blur-sm">
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Database className="w-4 h-4 text-violet-500" />
                    Discovery Canvas
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                    Tracking your requirements in real-time.
                </p>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">

                    {/* Progress / Status */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Session Progress</h3>
                        <div className="flex items-center gap-2">
                            <div className={cn("h-1 flex-1 rounded-full", route ? "bg-violet-500" : "bg-slate-200")} />
                            <div className={cn("h-1 flex-1 rounded-full", messages.length > 5 ? "bg-violet-500" : "bg-slate-200")} />
                            <div className={cn("h-1 flex-1 rounded-full", generatedSpec ? "bg-green-500" : "bg-slate-200")} />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                            <span>Route</span>
                            <span>Discovery</span>
                            <span>Spec</span>
                        </div>
                    </div>

                    {/* What We Know */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                            <Lightbulb weight="fill" className="text-amber-400 w-3 h-3" />
                            Key Insights
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {insights.length === 0 && <span className="text-xs text-slate-400 col-span-2 italic">Gathering insights...</span>}
                            {insights.map((item, idx) => (
                                <div key={idx} className="bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                                    <div className="text-[10px] text-slate-400 uppercase">{item.label}</div>
                                    <div className="text-xs font-semibold text-slate-700">{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Q&A History */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                            <Question weight="bold" className="text-blue-400 w-3 h-3" />
                            Q&A History ({qaPairs.length})
                        </h3>

                        {qaPairs.length === 0 && (
                            <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl">
                                <Clock className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                                <p className="text-xs text-slate-400">Conversation history will appear here.</p>
                            </div>
                        )}

                        <div className="space-y-3">
                            {qaPairs.map((pair) => (
                                <div key={pair.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 hover:shadow-md transition-shadow">
                                    <div className="text-[11px] font-medium text-slate-500 mb-1.5 flex gap-2">
                                        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">Q</span>
                                        {pair.question}
                                    </div>
                                    <div className="text-xs text-slate-800 leading-relaxed pl-6 relative">
                                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-violet-500/30 rounded-full" />
                                        {pair.answer}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </ScrollArea>
        </div>
    );
}
