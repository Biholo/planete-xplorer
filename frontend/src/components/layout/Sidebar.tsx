'use client';

import type React from 'react';
import { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
    ChevronLeft,
    Globe,
    Home,
    Rocket,
    Search,
    Settings,
    Sparkles,
    Star,
    Telescope,
    User,
} from 'lucide-react';

interface SidebarItem {
    icon: React.ReactNode;
    label: string;
    href: string;
    category?: string;
}

export default function Sidebar() {
    const [isExpanded, setIsExpanded] = useState(true);

    const menuItems: SidebarItem[] = [
        { icon: <Telescope size={20} />, label: 'Objets Célestes', href: '/celestial-objects', category: 'Navigation Principale' },
        { icon: <Star size={20} />, label: 'Catégories', href: '/categories', category: 'Gestion' },
        { icon: <Globe size={20} />, label: 'Systèmes', href: '/systems', category: 'Gestion' },
       
    ];

    const groupedItems = menuItems.reduce((acc, item) => {
        const category = item.category || 'Autres';
        if (!acc[category]) acc[category] = [];
        acc[category].push(item);
        return acc;
    }, {} as Record<string, SidebarItem[]>);

    return (
        <motion.div
            animate={{ width: isExpanded ? '280px' : '70px' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="h-screen relative bg-gradient-to-b from-[#0B0C10] via-[#1F2833] to-[#0B0C10] text-[#C5C6C7] flex flex-col border-r border-[#45A29E]/30 shadow-2xl"
            style={{
                boxShadow: '0 0 30px rgba(102, 252, 241, 0.1)',
            }}
        >
            {/* Animated starfield background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-4 left-4 w-1 h-1 bg-[#66FCF1] rounded-full animate-pulse"></div>
                <div className="absolute top-16 right-6 w-0.5 h-0.5 bg-[#45A29E] rounded-full animate-pulse delay-300"></div>
                <div className="absolute bottom-20 left-8 w-1 h-1 bg-[#66FCF1] rounded-full animate-pulse delay-700"></div>
                <div className="absolute bottom-40 right-4 w-0.5 h-0.5 bg-[#45A29E] rounded-full animate-pulse delay-1000"></div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute -right-3 top-8 bg-gradient-to-r from-[#45A29E] to-[#66FCF1] p-1.5 rounded-full text-white hover:from-[#66FCF1] hover:to-[#45A29E] transition-all duration-300 z-10"
                style={{
                    boxShadow: '0 0 15px rgba(102, 252, 241, 0.5)',
                }}
            >
                <motion.div
                    animate={{ rotate: isExpanded ? 0 : 180 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronLeft size={16} />
                </motion.div>
            </button>

            {/* Header Section */}
            <div className="flex items-center gap-4 p-6 border-b border-[#45A29E]/20">
                <div className="relative flex-shrink-0">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    >
                        <Rocket size={28} className="text-[#66FCF1]" />
                    </motion.div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#66FCF1] rounded-full animate-pulse"></div>
                </div>
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col"
                        >
                            <h1 className="font-bold text-lg text-[#66FCF1] tracking-wider font-mono">
                                PlanèteXplorer
                            </h1>
                            <span className="text-xs text-[#45A29E] font-mono tracking-wide">
                                🌌 Explorateur Galactique
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
                {Object.entries(groupedItems).map(([category, items]) => (
                    <div key={category}>
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.h3
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-[#45A29E] font-semibold text-sm uppercase tracking-wider mb-3 font-mono"
                                >
                                    {category}
                                </motion.h3>
                            )}
                        </AnimatePresence>
                        <div className="space-y-1">
                            {items.map((item) => (
                                <motion.a
                                    key={item.label}
                                    href={item.href}
                                    className="flex items-center gap-4 text-[#C5C6C7] hover:text-[#66FCF1] hover:bg-[#45A29E]/10 rounded-lg p-3 transition-all duration-300 group relative overflow-hidden"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{
                                        boxShadow: 'inset 0 0 0 1px transparent',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = 'inset 0 0 0 1px rgba(102, 252, 241, 0.3), 0 0 10px rgba(102, 252, 241, 0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = 'inset 0 0 0 1px transparent';
                                    }}
                                >
                                    {/* Glow effect on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#45A29E]/0 to-[#66FCF1]/0 group-hover:from-[#45A29E]/5 group-hover:to-[#66FCF1]/5 transition-all duration-300"></div>
                                    
                                    <span className="flex-shrink-0 group-hover:text-[#66FCF1] transition-colors duration-300 relative z-10">
                                        {item.icon}
                                    </span>
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ duration: 0.3 }}
                                                className="text-sm whitespace-nowrap font-medium relative z-10"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

        </motion.div>
    );
}
