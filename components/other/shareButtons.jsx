'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    Copy,
    Facebook,
    Linkedin,
    Mail,
    MessageCircle,
    Send,
    Share2,
    Twitter,
} from 'lucide-react';

const SOCIAL_MEDIA_MAP = {
    x: {
        key: 'x',
        label: 'X',
        icon: Twitter,
        buildShareUrl: ({ url, text }) => `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    },
    facebook: {
        key: 'facebook',
        label: 'Facebook',
        icon: Facebook,
        buildShareUrl: ({ url }) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    linkedin: {
        key: 'linkedin',
        label: 'LinkedIn',
        icon: Linkedin,
        buildShareUrl: ({ url }) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    whatsapp: {
        key: 'whatsapp',
        label: 'WhatsApp',
        icon: MessageCircle,
        buildShareUrl: ({ url, text }) => `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`.trim())}`,
    },
    telegram: {
        key: 'telegram',
        label: 'Telegram',
        icon: Send,
        buildShareUrl: ({ url, text }) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    },
    email: {
        key: 'email',
        label: 'Email',
        icon: Mail,
        buildShareUrl: ({ url, text }) => `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`,
    },
    copy: {
        key: 'copy',
        label: 'Copy Link',
        icon: Copy,
        action: 'copy',
    },
    native: {
        key: 'native',
        label: 'Share',
        icon: Share2,
        action: 'native',
    },
};

const DEFAULT_SOCIAL_MEDIA_KEYS = [
    'x',
    'facebook',
    'linkedin',
    'whatsapp',
    'telegram',
    'email',
    'copy',
    'native',
];

export default function ShareButtons({
    socialMedias = DEFAULT_SOCIAL_MEDIA_KEYS,
    title = '',
    className = '',
}) {
    const [currentUrl, setCurrentUrl] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentUrl(window.location.href);
        }
    }, []);

    const shareText = useMemo(() => {
        if (title && typeof title === 'string') return title;
        if (typeof document !== 'undefined') return document.title || '';
        return '';
    }, [title]);

    const normalizedSocials = (Array.isArray(socialMedias) && socialMedias.length ? socialMedias : DEFAULT_SOCIAL_MEDIA_KEYS)
        .map((key) => SOCIAL_MEDIA_MAP[key])
        .filter(Boolean);

    const handleShare = async (item) => {
        if (!currentUrl) return;

        if (item.action === 'copy') {
            try {
                await navigator.clipboard.writeText(currentUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
            } catch (error) {
                console.error('Failed to copy link:', error);
            }
            return;
        }

        if (item.action === 'native') {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: shareText,
                        url: currentUrl,
                    });
                } catch (error) {
                    // User cancellation should not break UI.
                    console.error('Native share was not completed:', error);
                }
            }
            return;
        }

        if (typeof item.buildShareUrl === 'function') {
            const url = item.buildShareUrl({ url: currentUrl, text: shareText });
            window.open(url, '_blank', 'noopener,noreferrer,width=760,height=640');
        }
    };

    return (
        <div className={`flex flex-wrap items-center gap-2 ${className}`}>
            {normalizedSocials.map((item) => {
                const Icon = item.icon;
                const isNativeDisabled = item.action === 'native' && typeof navigator !== 'undefined' && !navigator.share;

                return (
                    <button
                        key={item.key}
                        type="button"
                        onClick={() => handleShare(item)}
                        disabled={!currentUrl || isNativeDisabled}
                        title={item.label}
                        aria-label={item.label}
                        className="group inline-flex items-center gap-2 rounded-xl border border-emerald-100/80 bg-white/80 px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100/80 text-emerald-700 transition group-hover:bg-emerald-200">
                            <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span>{item.action === 'copy' && copied ? 'Copied' : item.label}</span>
                    </button>
                );
            })}
        </div>
    );
}