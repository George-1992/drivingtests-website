import FormBuilder from "@/components/formBuilder";
import ContactForm from "@/components/other/contactForm";
import ShareButtons from "@/components/other/shareButtons";
import PageWrapper from "@/components/pageWrapper";
import { CheckCircle2Icon, MessageSquareQuoteIcon, SparklesIcon } from "lucide-react";

export default function Page() {
    const highlights = [
        "Production AI built for real workflows",
        "Automation focused on operations and revenue",
        "Guaranteed-results mindset with flexible terms",
    ];

    return (
        <PageWrapper
            params={{
                slug: ['contact-us'],
            }}
            pageData={{
                title: 'Contact Us',
                description: 'Have questions or need guidance? Contact us to learn how Dttraining can support your driving tests preparation.',
            }}
        >
            <div className="w-full py-10">
                <h1 className="text-4xl mt-0 sm:text-5xl font-bold text-center mb-5">
                    Contact Us
                </h1>
                <div className="mb-5 w-full flex flex-col gap-5 items-center">
                    <ShareButtons
                        socialMedias={[
                            'linkedin',
                            'email',
                            'copy',
                            'share',
                            'native',
                        ]}
                    />
                    <p className="text-center">
                        Have a question about our services or the funding schemes we support? Contact us below:
                    </p>
                </div>

                <div className="py-10 max-w-xl m-auto">

                    <FormBuilder
                        fields={[
                            { name: 'first_name', label: 'First Name', type: 'text', required: true },
                            { name: 'last_name', label: 'Last Name', type: 'text', required: true },
                            { name: 'email', label: 'Email', type: 'email', required: true },
                            { name: 'subject', label: 'Subject', type: 'text', required: true },
                            { name: 'message', label: 'Message', type: 'textarea', required: true },
                            { name: 'newsletter', label: 'Subscribe to newsletter', type: 'checkbox', required: false, checkboxLabel: 'I want to receive updates and news from Dttraining.' },
                            { name: 'gdpr', label: 'GDPR Consent', type: 'checkbox', required: true, checkboxLabel: 'I consent to the processing of my personal data in accordance with the GDPR and Dttraining\'s privacy policy.' }
                        ]}
                        data={{
                            action: "contact-form",
                        }}
                    />
                </div>
            </div>
        </PageWrapper >
    );
}
