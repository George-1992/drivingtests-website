import Link from "next/link";

export default function Testimonials() {

    const data = [
        {
            id: 1,
            title: "ERC Consulting",
            description: "*Some testimonials are anonymous by the customers' wish to remain private.",
            items: [
                {
                    "title": "Theodossis Theodossiou",
                    "description": "“The services of Enspire were of very high quality. The advisors are very experienced, and they were really attentive to detail. They provided me with great guidance in a grant scheme which I had no prior experience with. This helped my application become focused and to the point. The communication was good and frequent and they were there to answer all my questions. I fully recommend Enspire’s “deep dive” experience, I feel it has significantly enhanced my chances of success.” ERC AdG Deep Dive service",
                    "serviceName": "ERC AdG Deep Dive service"
                },
                {
                    "title": "Amin Mojiri",
                    "description": "“I received some great comments about improving risk/challenges and hypotheses during writing the proposal. I found how to connect the methodology with risk and hypotheses.” ERC StG Deep Dive service",
                    "serviceName": "ERC StG Deep Dive service"
                },
                {
                    "title": "Damián Monllor-Satoca",
                    "description": "“The service provided was excellent. The advisor was close to my knowledge area, thus his insights were very helpful in shaping the project’s vision and main idea. Besides, he had a thorough technical knowledge of the proposal parts, helping us on completing all expected aspects of it.” ERC CoG Deep Dive service",
                    "serviceName": "ERC CoG Deep Dive service"
                },
                {
                    "title": "",
                    "description": "“When you first apply to an ERC grant you are a bit lost, and ENSPIRE support is very clarifying, allowing you to focus on the proper proposal. There is also advice about what is important and what is not, that I guess is crucial. It is not a normal call, and if you don´t realise that, your chances are even more limited.” ERC AdG Deep Dive services",
                    "serviceName": "ERC AdG Deep Dive services"
                },
                {
                    "title": "",
                    "description": "“I am both very satisfied and happy with the assistance and help from ENSPIRE. Writing an ERC grant is completely different from writing a national grant proposal. Despite my large experience, I do not think I would have been able to prepare, without the help of ENSPIRE, the grant according to the requirements of ERC. As a whole, I am very much impressed by the professionalism of ENSPIRE.” ERC AdG Deep Dive service",
                    "serviceName": "ERC AdG Deep Dive service"
                },
                {
                    "title": "Wilhelm Hofmann",
                    "description": "“The feedback from Enspire was always spot on. It really helped me to think about my grant from all perspectives, identify potential issues, and iron out the weak spots of my proposal. As a result, the final proposal has improved a lot throughout the consulting process and has become much more balanced. Highly recommended!” ERC AdG Deep Dive service",
                    "serviceName": "ERC AdG Deep Dive service"
                },
                {
                    "title": "",
                    "description": "“Writing proposals isn’t my favorite task (who enjoys it, really?), but you made the process much more enjoyable. I was impressed by your top-notch expertise and professionalism, and I’m very pleased with the final shape of my proposal!” ERC AdG Deep Dive service",
                    "serviceName": "ERC AdG Deep Dive service"
                },
                {
                    "title": "",
                    "description": "“The in depth review was a fantastic help! Consultant carefully read not only current application, but also previous applications; was very constructive in idea and knowledge gap shaping as well as choice and addressing of the panel. The consultant was there along the whole way, including ensuring that all the forms in the portal are completed. It was a true pleasure working with Enspire!” ERC CoG Deep Dive service",
                    "serviceName": "ERC CoG Deep Dive service"
                },
                {
                    "title": "",
                    "description": "“[…] I was able to send my proposal template whenever I wanted and received very timely feedback. I believe there has been considerable improvement in my proposal thanks to this feedback. I would like to remind everyone that it is definitely necessary to start early to benefit more from Enspire. Thank you very much for your support!” ERC CoG Deep Dive service",
                    "serviceName": "ERC CoG Deep Dive service"
                },
                {
                    "title": "Michael O’Reilly",
                    "description": "“Prompt and helpful guidance provided in a non-judgemental manner. The feedback helped to focus my application and to avoid any suggestions of incrementality. Writing ERC grants often does not align with typical requirements of other funding streams and so ENSPIRE’s feedback was critical in this regard.” ERC CoG Deep Dive service",
                    "serviceName": "ERC CoG Deep Dive service"
                },
                {
                    "title": "Andreas Rupp",
                    "description": "“Enspire helped structure my application in the ERC style: The online courses and the consultant’s comments changed and improved my application.” ERC StG Deep Dive service",
                    "serviceName": "ERC StG Deep Dive service"
                },
                {
                    "title": "Çiler Çelik Özenci",
                    "description": "“[…] Upon receipt of a thorough and comprehensive series of reviews, I found that every facet of the service provided was not only beneficial, but also instrumental in refining and enhancing my proposal. The rigorous critique, combined with constructive feedback, resulted in significant improvement to the overall structure, content, and presentation of my proposal.” ERC AdG Deep Dive service",
                    "serviceName": "ERC AdG Deep Dive service"
                },
                {
                    "title": "Jakob Lund Dideriksen",
                    "description": "“The online material and the feedback (deep dive review) was overall very helpful in the writing process. The feedback was to-the-point, constructive, and consistent in the sense that it often referred to the basic requirements for ERC applications (high-risk/gain, non-incremental ect). The comments in each round of revisions clearly directed me in path forward. The reviewer seemed happy to engage in constructive discussions about the comments. Overall, the service had a substantial impact on my application. […]” ERC CoG Deep Dive service",
                    "serviceName": "ERC CoG Deep Dive service"
                },
                {
                    "title": "",
                    "description": "“[…] The initial information material online was extremely helpful to understand what a “good” ERC application is! This was completely new to me, and I learnt a lot about the process from watching the videos. My consultant was extremely competent, professional, motivating and supportive. […] Their feedback helped me immensely in the process of rewriting my application and made me trust the process a lot. I did not think the final technical review would be so important, but it was very valuable to get someone else to look over it, which take a bit of pressure off one’s shoulders.” ERC StG Deep Dive service",
                    "serviceName": "ERC StG Deep Dive service"
                },
                {
                    "title": "",
                    "description": "“The consultant worked closely with us from the beginning to the end of the grant development, writing, and submission process. The consultant was responsive, timely, and very detailed. She is so knowledgeable about the ERC and their specifications and the logic of Horizon grants. I felt very assured having her supporting us as a team.” ERC SyG Deep Dive service",
                    "serviceName": "ERC SyG Deep Dive service"
                },
                {
                    "title": "",
                    "description": "“It was tremendously helpful to learn about the non-intuitive aspects of the structure and content of the two proposal parts. I had originally overstated what societal relevance the proposed work might have and the proposal lacked fundamental, high-risk aspects (or better, it lacked clarity with respect to those aspects). The input and guidance with respect to structure and content was very very helpful, in particular, as many of my peers would provide opposite comments.” ERC CoG Deep Dive service",
                    "serviceName": "ERC CoG Deep Dive service"
                },
                {
                    "title": "",
                    "description": "“All parts were precious to me, including the online materials (e.g., aggregated overview of the panel members) and the online videos; the best part of this service was my consultant, who gave me many times precious and detailed feedback on my project in regard to the writing and communicating the ideas, structure and organisation of the proposal, technical aspects, and the content-related questions. Big THANK YOU to Enspire!” ERC CoG Deep Dive service",
                    "serviceName": "ERC CoG Deep Dive service"
                },
                {
                    "title": "Alice Marino",
                    "description": "“Enspire Consulting provided invaluable support throughout my ERC application process. The assigned consultant was consistently available, offering timely responses and constructive feedback on my drafts. Her expertise helped me understand the specific requirements of the ERC and pushed me to significantly strengthen my proposal. Thanks to her targeted advice, I felt confident that my application was more competitive and of higher quality than it would have been on my own.” ERC StG Deep Dive service",
                    "serviceName": "ERC StG Deep Dive service"
                },
                {
                    "title": "James Michael Gahan",
                    "description": "“The service provided by Enspire was absolutely amazing. My proposal is very much improved due to the feedback I obtained. In particular, Enspire’s services help me to mould my research ideas into a more “ERC-style” proposal and also help me to ensure all the important points for ERC review were covered!” ERC StG Deep Dive service",
                    "serviceName": "ERC StG Deep Dive service"
                },
                {
                    "title": "Cécile Formosa-Dague",
                    "description": "“Through the help I receive from Enspire, I could finally understand what was important for an ERC application, and how to write and make these important elements very clear in the text (groundbreaking idea, scientific question, hypothesis and high risk/high gain). I was also pushed with incisive questions to the limits of the project, allowing to make a very clear, coherent and detailed methodology. I feel like I now have a chance on this call, which would never have been the case without the right support. […]” ERC StG Deep Dive service",
                    "serviceName": "ERC StG Deep Dive service"
                }
            ]
        },
        {
            id: 2,
            title: "Collaborative Projects in Horizon Europe Consulting",
            description: "*Some testimonials are anonymous by the customers' wish to remain private.",
            items: [
                {
                    "title": "",
                    "description": "The Enspire consultants were very professional and supportive throughout the whole process of preparing the proposal. They not only know what the funding agency is looking for but also understand the subject matter of the proposal and can propose improvements to the project and suggest how to build the consortium. I particularly appreciated their responsiveness all the way up to the deadline. Highly recommended! Pillar II – Health",
                    "serviceName": "Pillar II – Health"
                },
                {
                    "title": "Anna Windmüller",
                    "description": "“The Deep Dive Review service was invaluable in helping us prepare our application. From the outset, the Enspire science team provided comprehensive support, ensuring that we remained aligned with the call’s objectives and that our proposal clearly communicated our joint vision. […] The resources they provided—including templates, step-by-step instructions, and critical technical and scientific reviews—helped us shape a compelling and cohesive submission. […] We are truly grateful for their dedicated service and support. Their consistent and structured approach was key to guiding us through the preparation process, ensuring that our submission was both strong and well-coordinated.” Pillar II – Global challenges and European industrial competitiveness",
                    "serviceName": "Pillar II – Global challenges and European industrial competitiveness"
                },
                {
                    "title": "Javed Hussain Niazi",
                    "description": "“I would like to express my heartfelt appreciation for the exceptional service & expertise provided by Enspire Science. […] The tailored consulting services were crucial in enhancing our project proposal. […] Thank you, for your invaluable support in bringing this project to fruition. Your dedication to excellence is commendable.” Widening Participation and Spreading Excellence actions",
                    "serviceName": "Widening Participation and Spreading Excellence actions"
                },
                {
                    "title": "",
                    "description": "“We recently had the pleasure of working with Enspire, and I must say, that their service exceeded our expectations in every way. From the moment we engaged with them, we experienced an exceptional level of professionalism, expertise, and dedication to our project. One of the standout aspects of Enspire is its deep knowledge in the field of scientific research and proposal preparation. Their team is highly skilled in crafting compelling and high-quality research grant proposals that are tailored to meet the unique requirements of the Teaming programme. […] Overall, our experience with Enspire Science was outstanding. Their combination of scientific acumen, personalized support, and excellent communication made the entire process smooth. I highly recommend their services to any researcher looking to strengthen their grant proposals and increase their chances of securing funding.” Widening Participation and Spreading Excellence actions",
                    "serviceName": "Widening Participation and Spreading Excellence actions"
                },
                {
                    "title": "",
                    "description": "“Thanks a lot for doing this awesome job. The proposal looks very convincing! Hope we will get the chance to work together and thanks to everybody contributing.” Pillar II – Global challenges and European industrial competitiveness",
                    "serviceName": "Pillar II – Global challenges and European industrial competitiveness"
                },
                {
                    "title": "",
                    "description": "“Thanks a lot for the encouragement, your help and support! It has been a pleasure working together with you.” Pillar II – Global challenges and European industrial competitiveness",
                    "serviceName": "Pillar II – Global challenges and European industrial competitiveness"
                },
                {
                    "title": "",
                    "description": "“We are very happy for this outcome, and I would like to thank the Enspire team for helping us. You did an amazing job! We could not be happier for the help you have provided, and we are grateful that you took on the task when I initially approached you.” Pillar II – Global challenges and European industrial competitiveness",
                    "serviceName": "Pillar II – Global challenges and European industrial competitiveness"
                },
                {
                    "title": "",
                    "description": "“Thank you for the work we have done together and for your support and your availability.” Pillar II – Global challenges and European industrial competitiveness",
                    "serviceName": "Pillar II – Global challenges and European industrial competitiveness"
                },
                {
                    "title": "",
                    "description": "“Thank you, very much! Your help has been crucial for the application to succeed. I am sure we will be able to rely on your help in the future.” Pillar II – Global challenges and European industrial competitiveness",
                    "serviceName": "Pillar II – Global challenges and European industrial competitiveness"
                }
            ]
        },
        {
            id: 3,
            title: "Personalized ERC Interview Preparation",
            description: "*Some testimonials are anonymous by the customers' wish to remain private.",
            items: [
                {
                    "title": "Fernando P. Cossío",
                    "description": "“The preparation sessions were very useful. Our presentation, carefully prepared and taking into account your indications about the “narrative” of the project, was positively perceived. The time limit, carefully prepared in the preparation sessions, was strictly followed, which was positively assessed by the president of the panel. Several questions previously anticipated in these sessions were formulated in the “real” interview. These questions included the coordination between the components of the device, the training of the students, and the sensitivity and selectivity of the detector.” ERC SyG Interview",
                    "serviceName": "ERC SyG Interview"
                },
                {
                    "title": "Juan Jose Gomez Cadenas",
                    "description": "“Our interaction with your team was very satisfactory in my opinion. It was useful to prepare and rehearse the interview, and your comments and tips were very relevant.” ERC SyG Interview",
                    "serviceName": "ERC SyG Interview"
                },
                {
                    "title": "Maria Rodriguez Aburto",
                    "description": "“Preparing for my ERC Interview with Enspire has been a great journey, from my first written draft all the way to the last version of my interview presentation. It has helped me tremendously to create a proposal to be proud of. I’m really thankful and would always recommend Enspire!” ERC StG Interview",
                    "serviceName": "ERC StG Interview"
                },
                {
                    "title": "",
                    "description": "“I enjoyed and learned a lot from the personalized preparation process. I believe the personnel is very well qualified and ready to spot important aspects to be highlighted in the presentation.” ERC StG Interview",
                    "serviceName": "ERC StG Interview"
                },
                {
                    "title": "",
                    "description": "“The personalised ERC interview preparation sessions with you were precious brainstorming moments, providing useful tips and food for thought, and definitely improving my preparation. The consultants were deep, accurate, careful, insightful, as well as very friendly and pleasant to interact with. Kudos!” ERC StG Interview",
                    "serviceName": "ERC StG Interview"
                },
                {
                    "title": "Riccardo Marin",
                    "description": "“I think the preparation service was extremely helpful, in particular for the Q&A time. […] I feel that the most valuable aspect of the preparation was to disclose exactly how the interview would be like and the type of questions to expect […]” ERC StG Interview",
                    "serviceName": "ERC StG Interview"
                },
                {
                    "title": "",
                    "description": "“The person I was working with encouraged me to steer my presentation in such a way that it focused on the most innovative aspects of my project and its high gains. The process allowed me to rethink my application and get ready to face the interview questions too.” ERC StG Interview",
                    "serviceName": "ERC StG Interview"
                },
                {
                    "title": "",
                    "description": "“Thanks to this preparation, I was really ready already for the mock panel and the main interview and suggestions influenced the final presentation and its course.” ERC AdG Interview",
                    "serviceName": "ERC AdG Interview"
                },
                {
                    "title": "",
                    "description": "“The preparation made me understand who I will be addressing and what they are after. And it made me understand how to prepare. This was especially useful in connection with the presentation.” ERC AdG Interview",
                    "serviceName": "ERC AdG Interview"
                },
                {
                    "title": "Nils Goseberg",
                    "description": "“The online course was very good and helped together with the preparatory meeting with the consultant to get an idea what content I would need to prepare for the slides. The rehearsals were excellent, and each slide got considerable review with constructive comments.” ERC CoG Interview",
                    "serviceName": "ERC CoG Interview"
                },
                {
                    "title": "",
                    "description": "“I meet with the consultant three times, one for just planning, and then for the rehearsals. The questions and suggestions were very helpful and made me improve my presentation extensively.” ERC StG Interview",
                    "serviceName": "ERC StG Interview"
                },
                {
                    "title": "Laura Righetti",
                    "description": "“I would recommend anyone to follow the personalized ERC interview preparation sessions with Enspire. My reviewer thoroughly read my proposal and helped me in shaping the presentation to highlight and clarify aspects that were not well discussed in the written proposal. She gave me very useful suggestions from a very critical point of view. […]” ERC StG Interview",
                    "serviceName": "ERC StG Interview"
                }
            ]
        },
        {
            id: 4,
            title: "Our Courses",
            description: "*Some testimonials are anonymous by the customers' wish to remain private.",
            items: [
                {
                    "title": "Nuno Bicho",
                    "description": "“Everything was very clear and informative. To me, it really helped to clarify many aspects of the official information given by ERC and in many instances helped me to think in different manners that were not clear in the ERC documents.” ERC Beyond pre-recorded course",
                    "serviceName": "ERC Beyond pre-recorded course"
                },
                {
                    "title": "Jaume Ferrer Lalanza",
                    "description": "“The most interesting content of the pre-recorded videos was about the writing process, tips advice, and the high-gain/high-risk and impact explanation. In addition, the language was really clear and the examples and slides very illustrative.” ERC Beyond pre-recorded course",
                    "serviceName": "ERC Beyond pre-recorded course"
                },
                {
                    "title": "María Martín Seijo",
                    "description": "“The course has provided information that was not available in other webinars or workshops, and it was very helpful for preparing my StG proposal.” ERC Basics & Beyond pre-recorded course",
                    "serviceName": "ERC Basics & Beyond pre-recorded course"
                },
                {
                    "title": "Marjan Safarzadeh",
                    "description": "“Thank you for the course, It was very informative and the videos were clear. It was excellent.” MSCA-PF pre-recorded course",
                    "serviceName": "MSCA-PF pre-recorded course"
                },
                {
                    "title": "José Duarte",
                    "description": "“The course was full of details that I think will cover all possible doubts regarding the application and fellowship time.” MSCA-PF pre-recorded course",
                    "serviceName": "MSCA-PF pre-recorded course"
                },
                {
                    "title": "Sofia Rita Fernandes",
                    "description": "“This is a very useful and well-organized course. Even if directed for ERC calls, it gives some useful skills to apply in all kinds of applications.” ERC Beyond pre-recorded course",
                    "serviceName": "ERC Beyond pre-recorded course"
                },
                {
                    "title": "",
                    "description": "“The course answered my questions regarding the ERC Interview procedure. It raised my awareness for what I need to focus on in the interview and the preparation, which was very valuable.” ERC Interview live online course",
                    "serviceName": "ERC Interview live online course"
                },
                {
                    "title": "",
                    "description": "“The course provided a practical and helpful introduction to the EU funding scheme and various subareas of the available options for grant applications. I found particularly interesting the parts in which the complicated terms used by the EU Work Programmes were clarified, and the methods how to address the relevant requirements were presented. […] I recommend participation in such a course.” Collaborative projects in Horizon Europe on-site course",
                    "serviceName": "Collaborative projects in Horizon Europe on-site course"
                },
                {
                    "title": "Carmen Sorasan",
                    "description": "“This course provided me with useful and practical information, especially about budgeting.” Collaborative projects in Horizon Europe on-site course",
                    "serviceName": "Collaborative projects in Horizon Europe on-site course"
                },
                {
                    "title": "",
                    "description": "“I am very satisfied with the training. The Enspire experts presented deep knowledge and experience in the EU grants. There was no question left unanswered even if from outside the scope of the training.” Collaborative projects in Horizon Europe live online course",
                    "serviceName": "Collaborative projects in Horizon Europe live online course"
                },
                {
                    "title": "",
                    "description": "“The course provided both helpful and practical information. It helped me better understand some terms by providing definitions, clarifying the differences with other similar ones, and giving examples.” Horizon Europe Impact live online course",
                    "serviceName": "Horizon Europe Impact live online course"
                },
                {
                    "title": "Lourdes Morillas",
                    "description": "“It was very convenient and high quality information. The example of classy chassis was very helpful as well. The Q&A session was very informative and well-planned.” Collaborative projects in Horizon Europe pre-recorded course",
                    "serviceName": "Collaborative projects in Horizon Europe pre-recorded course"
                },
                {
                    "title": "Bilel Mehnen",
                    "description": "“I am very satisfied, all parts of the course are very useful for me. The presentation of the course was wonderful. Thank you very much!” MSCA-PF on-site course",
                    "serviceName": "MSCA-PF on-site course"
                },
                {
                    "title": "",
                    "description": "“The course was very helpful. It was clear, concise and well-organised, providing useful information and tips for how to best prepare an MSCA postdoctoral fellowship application. The opportunity for participants to ask questions throughout was very much appreciated, and these were all answered in a well-informed and thoughtful manner. Having completed the course, I feel I am in a better position to write a stronger application.” MSCA-PF live online course",
                    "serviceName": "MSCA-PF live online course"
                },
                {
                    "title": "André Pinheiro de Sousa",
                    "description": "“The course was very useful for me since I do not have any experience dealing with Lump Sum funding and I will probably have to deal with it in a near future. The course provided very useful general and specific information namely about Work Packages, Reporting, etc. […]” Lump Sum funding in Horizon Europe live online course",
                    "serviceName": "Lump Sum funding in Horizon Europe live online course"
                },
                {
                    "title": "Montserrat Gutiérrez",
                    "description": "“In general, I found it to be a course with relevant information. Especially the part about 2.1 Project’s Pathways Towards Impact […] Thank you.” Horizon Europe Impact live online course",
                    "serviceName": "Horizon Europe Impact live online course"
                },
                {
                    "title": "",
                    "description": "“I found the information very useful. Especially about the structure of the presentation at the interview and the most common questions expected of the panel.” ERC CoG Interview live online course",
                    "serviceName": "ERC CoG Interview live online course"
                },
                {
                    "title": "",
                    "description": "“The course was helpful and compact. It was understandable for any level of participant. The clinical trial part was the most productive part for me. The training was well-prepared and well-designed.” Collaborative projects in Horizon Europe on-site course",
                    "serviceName": "Collaborative projects in Horizon Europe on-site course"
                },
                {
                    "title": "",
                    "description": "“The speaker of the course was excellent. She spoke clearly and covered all the aspects of the application and answered all our questions. The course helped us understand how to proceed, what to do and what to avoid.” ERC Beyond on-site course",
                    "serviceName": "ERC Beyond on-site course"
                },
                {
                    "title": "",
                    "description": "“Great course, invaluable insights into the visible and “hidden” facets of an ERC Advanced Grant application. These guys really know what they are talking about…” ERC Beyond on-site course",
                    "serviceName": "ERC Beyond on-site course"
                }
            ]
        }
    ]
    const cardStyles = [
        {
            wrapper: "bg-white border-emerald-600",
            name: "text-emerald-900",
            quote: "text-slate-700",
            badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
        },
        {
            wrapper: "bg-gradient-to-br from-orange-50 via-white to-amber-50 border-amber-500",
            name: "text-amber-900",
            quote: "text-slate-700",
            badge: "bg-amber-100 text-amber-900 border-amber-200",
        },
        {
            wrapper: "bg-gradient-to-br from-cyan-50 via-white to-teal-50 border-cyan-600",
            name: "text-cyan-900",
            quote: "text-slate-700",
            badge: "bg-cyan-100 text-cyan-900 border-cyan-200",
        },
    ];

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {
                    data && data.map((item, index) => {
                        return (
                            <Link
                                key={index}
                                href={`#testimonial-section-${item.id}`}
                                className="bg-neutral-50 rounded-2xl p-6 shadow-md hover:bg-neutral-100 transition-colors duration-200 flex items-center justify-center"
                            >
                                <p className="text-xl font-bold text-emerald-900 mb-3">{item.title}</p>
                            </Link>
                        );
                    })
                }
            </div>
            {
                data && data.map((item, index) => {

                    return (
                        <div key={index} className="mb-10" id={`testimonial-section-${item.id}`}>
                            <h4 className="text-2xl font-bold text-emerald-900 mb-3">{item.title}</h4>
                            <p className="text-slate-600 text-lg mb-5">{item.description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {
                                    item.items.map((testimonial, idx) => {
                                        const style = cardStyles[idx % cardStyles.length];

                                        return (
                                            <article
                                                key={idx}
                                                className={`rounded-2xl border-t-4 p-6 shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md ${style.wrapper}`}
                                            >
                                                {testimonial.title ? (
                                                    <h3 className={`mb-2 text-xl font-bold ${style.name}`}>{testimonial.title}</h3>
                                                ) : (
                                                    <div className="mb-2 text-base font-semibold text-slate-500">Anonymous client</div>
                                                )}

                                                <p className={`text-sm leading-relaxed ${style.quote}`}>{testimonial.description}</p>

                                                {testimonial.serviceName ? (
                                                    <div className="mt-4">
                                                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${style.badge}`}>
                                                            {testimonial.serviceName}
                                                        </span>
                                                    </div>
                                                ) : null}
                                            </article>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    );
                })}
        </div>
    );
}