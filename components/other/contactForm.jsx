'use client';
import { sendEmailServer } from "@/actions/main";
import TurnstileEl from "@/components/turnstile";
import { ArrowRightIcon, CheckCircle2Icon, ShieldCheckIcon } from "lucide-react";
import { useState } from "react";


export default function ContactForm() {

    const fields = [
        {
            label: 'Name', type: 'text', name: 'name', required: true,
            validator: (value) => value.length >= 2
        },
        {
            label: 'Email', type: 'email', name: 'email', required: true,
            validator: (value) => /\S+@\S+\.\S+/.test(value)
        },
        {
            label: 'Message', type: 'textarea', name: 'message', required: true,
            validator: (value) => value.length >= 10
        },
    ];

    const [_formData, _setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [_isSent, _setIsSent] = useState(false);
    const [_turnstileToken, _setTurnstileToken] = useState('');
    const [_isSubmitting, _setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!_turnstileToken) {
            alert('Please complete the verification');
            return;
        }

        const dataToSend = {
            ..._formData,
            // turnstileToken: _turnstileToken
        };

        try {
            _setIsSubmitting(true);
            await sendEmailServer(JSON.stringify(dataToSend));
            _setIsSent(true);
        } finally {
            _setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        _setFormData({
            ..._formData,
            [name]: value,
        });
    }

    return (
        <div className="w-full rounded-[1.25rem] border border-white/10 bg-white/[0.02] p-4 sm:p-5 md:rounded-[1.5rem] md:p-7">
            <div className="mb-5 md:mb-6">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--accent)] sm:text-sm sm:tracking-[0.28em]">
                    Contact Form
                </p>
                <h2 className="mt-3 text-xl font-semibold leading-tight sm:text-2xl md:text-3xl">
                    Tell us what you want to improve.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-neutral-300 sm:text-base">
                    Share a few details about your business, your bottlenecks, or the kind of result you want to create.
                </p>
            </div>

            {
                _isSent && (
                    <div className="rounded-xl border border-lime-400/20 bg-lime-300/10 p-5 text-center sm:rounded-2xl sm:p-6">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-lime-300/15 text-lime-300 sm:h-14 sm:w-14">
                            <CheckCircle2Icon className="size-6 sm:size-7" />
                        </div>
                        <p className="text-lg font-semibold text-white sm:text-xl">
                            Thank you for contacting us.
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-neutral-300 sm:text-base">
                            Your message has been sent and we&apos;ll get back to you soon.
                        </p>
                    </div>
                )
            }

            {!_isSent &&
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    {fields.map((field, index) => (
                        <div key={index}>
                            <label className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-neutral-300 sm:text-sm sm:tracking-[0.18em]">
                                {field.label}
                            </label>
                            {field.type === 'textarea' ? (
                                <textarea
                                    id={field.name}
                                    name={field.name}
                                    required={field.required}
                                    className="min-h-[136px] w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-base text-white outline-none transition placeholder:text-neutral-500 focus:border-[var(--accent)]/50 focus:bg-black/35 sm:rounded-2xl"
                                    rows="5"
                                    value={_formData[field.name]}
                                    onChange={handleInputChange}
                                    placeholder={field.name === 'message' ? 'Tell us about your current workflow, challenge, or goal.' : ''}
                                    autoComplete="off"
                                ></textarea>
                            ) : (
                                <input
                                    id={field.name}
                                    type={field.type}
                                    name={field.name}
                                    required={field.required}
                                    className="min-h-12 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-base text-white outline-none transition placeholder:text-neutral-500 focus:border-[var(--accent)]/50 focus:bg-black/35 sm:rounded-2xl"
                                    value={_formData[field.name]}
                                    onChange={handleInputChange}
                                    placeholder={field.name === 'name' ? 'Your name' : 'you@company.com'}
                                    autoComplete={field.name === 'name' ? 'name' : 'email'}
                                    inputMode={field.type === 'email' ? 'email' : 'text'}
                                />
                            )}
                        </div>
                    ))}

                    <div className="overflow-x-auto overflow-y-hidden rounded-xl border border-white/10 bg-black/20 p-3 sm:rounded-2xl sm:p-4">
                        <TurnstileEl onVerify={(token) => _setTurnstileToken(token)} />
                    </div>

                    <div className="flex items-start gap-3 rounded-xl border border-[var(--accent)]/15 bg-[var(--accent)]/8 px-4 py-3.5 sm:rounded-2xl sm:py-4">
                        <ShieldCheckIcon className="mt-0.5 size-5 shrink-0 text-[var(--accent)]" />
                        <p className="text-xs leading-relaxed text-neutral-300 sm:text-sm">
                            We use verification to prevent spam and keep the inbox focused on real conversations.
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-lime-300 px-5 py-3.5 text-base font-semibold text-neutral-900 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 sm:rounded-2xl sm:py-4"
                        disabled={!_turnstileToken || _isSubmitting}
                    >
                        {_isSubmitting ? 'Sending...' : 'Send Message'}
                        {!_isSubmitting && <ArrowRightIcon className="size-4" />}
                    </button>
                </form>
            }
        </div>
    );
}
