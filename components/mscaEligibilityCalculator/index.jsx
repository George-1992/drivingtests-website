'use client';

import { Fragment, useMemo, useState } from 'react';

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const MSCA_PHD_CUTOFF = new Date(2017, 8, 10);
const MSCA_YEARS_LIMIT = 8;
const MSCA_YEARS_MOBILITY = 3;
const MSCA_MOBILITY_DAYS_LIMIT = 366;
const MSCA_DEADLINE = new Date(
    MSCA_PHD_CUTOFF.getFullYear() + MSCA_YEARS_LIMIT,
    MSCA_PHD_CUTOFF.getMonth(),
    MSCA_PHD_CUTOFF.getDate()
);

const monthArray = {
    '1': 'January',
    '2': 'February',
    '3': 'March',
    '4': 'April',
    '5': 'May',
    '6': 'June',
    '7': 'July',
    '8': 'August',
    '9': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December',
};

const emptyMobilityPeriod = (id) => ({
    id,
    startDay: '0',
    startMonth: '0',
    startYear: '0',
    endDay: '0',
    endMonth: '0',
    endYear: '0',
});

const toNumber = (value) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
};

const clampNonNegative = (value) => Math.max(0, toNumber(value));

const isCompleteDate = (day, month, year) =>
    toNumber(day) > 0 && toNumber(month) > 0 && toNumber(year) > 0;

const hasAnyDateValue = (...values) => values.some((value) => toNumber(value) > 0);

const getDate = (day, month, year) => {
    if (!isCompleteDate(day, month, year)) {
        return null;
    }

    const date = new Date(toNumber(year), toNumber(month) - 1, toNumber(day));
    const isValid =
        date.getFullYear() === toNumber(year) &&
        date.getMonth() === toNumber(month) - 1 &&
        date.getDate() === toNumber(day);

    return isValid ? date : null;
};

const diffDays = (endDate, startDate) => (endDate - startDate) / MS_PER_DAY;

const formatYears = (days) => (days / 365).toFixed(1);

const status = (kind, children) => <span className={kind}>{children}</span>;

export default function MSCAPFCalculator() {
    const [pastMSCA, setPastMSCA] = useState('');
    const [lowGrade, setLowGrade] = useState(false);
    const [noPhd, setNoPhd] = useState(false);
    const [phdDay, setPhdDay] = useState('0');
    const [phdMonth, setPhdMonth] = useState('0');
    const [phdYear, setPhdYear] = useState('0');
    const [phdDefend, setPhdDefend] = useState('');
    const [childrenNum, setChildrenNum] = useState(0);
    const [addMaternityDays, setAddMaternityDays] = useState(0);
    const [parentalDays, setParentalDays] = useState(0);
    const [startDay, setStartDay] = useState('');
    const [startMonth, setStartMonth] = useState('');
    const [startYear, setStartYear] = useState('');
    const [endDay, setEndDay] = useState('');
    const [endMonth, setEndMonth] = useState('');
    const [endYear, setEndYear] = useState('');
    const [ftePercent, setFtePercent] = useState(100);
    const [isEurope, setIsEurope] = useState('');
    const [tcResearch, setTcResearch] = useState('');
    const [tcStartDay, setTcStartDay] = useState('0');
    const [tcStartMonth, setTcStartMonth] = useState('0');
    const [tcStartYear, setTcStartYear] = useState('0');
    const [tcEndDay, setTcEndDay] = useState('0');
    const [tcEndMonth, setTcEndMonth] = useState('0');
    const [tcEndYear, setTcEndYear] = useState('0');
    const [nowInTc, setNowInTc] = useState(false);
    const [careerBreaks, setCareerBreaks] = useState(0);
    const [nationalService, setNationalService] = useState(0);
    const [sickLeaves, setSickLeaves] = useState(0);
    const [haveYouResided, setHaveYouResided] = useState('');
    const [mobilityPeriods, setMobilityPeriods] = useState([emptyMobilityPeriod(1)]);

    const currentYear = new Date().getFullYear();
    const daysArray = Array.from({ length: 31 }, (_, i) => i + 1);
    const yearsArray = Array.from({ length: 51 }, (_, i) => currentYear - i);
    const blockedByPreviousApplication = pastMSCA === 'yes' && lowGrade;
    const phdDate = getDate(phdDay, phdMonth, phdYear);
    const phdDateFilled = Boolean(phdDate);
    const extensionFieldsDisabled = blockedByPreviousApplication || !phdDateFilled || noPhd;
    const showEuropeanRow = isEurope === 'yes';
    const showTcRows = phdDateFilled && !noPhd && isEurope === 'yes' && tcResearch === 'yes';
    const showMobilityPeriods = haveYouResided === 'yes' && !blockedByPreviousApplication;

    const addPeriodMobility = () => {
        setMobilityPeriods((periods) => [...periods, emptyMobilityPeriod(periods.length + 1)]);
    };

    const removePeriodMobility = () => {
        setMobilityPeriods((periods) =>
            periods.length > 1 ? periods.slice(0, periods.length - 1) : periods
        );
    };

    const updateMobilityPeriod = (id, key, value) => {
        setMobilityPeriods((periods) =>
            periods.map((period) => (period.id === id ? { ...period, [key]: value } : period))
        );
    };

    const calculation = useMemo(() => {
        const blank = {
            mscaYearsCount: '',
            maternityLeaveDaysCount: '',
            fteDays: '',
            tcTotalDays: '',
            tcTotalDaysMessage: '',
            totalNumberOfExtensionDays: '',
            mscaYearsCountFTE: '',
            mscaEligibility: '',
            warningLineElig: '',
        };

        if (blockedByPreviousApplication) {
            return {
                ...blank,
                mscaEligibility: status('blocked', 'Not eligible (due to previous application)'),
            };
        }

        if (noPhd) {
            if (phdDefend === 'no') {
                return {
                    ...blank,
                    mscaEligibility: status('blocked', 'Not eligible (due to lack of PhD diploma)'),
                };
            }

            if (phdDefend === 'yes') {
                return {
                    ...blank,
                    mscaEligibility: status('eligible', 'Eligible (no need for extensions)'),
                };
            }

            return blank;
        }

        if (!phdDate) {
            return blank;
        }

        const yearsSincePhd = formatYears(diffDays(MSCA_DEADLINE, phdDate));
        const baseEligible = MSCA_PHD_CUTOFF <= phdDate;
        let totalExtensionDays = 0;
        let partialNonResearch = false;
        let partialTc = false;
        let tcEndTooOld = false;
        let fteDays = '';
        let tcTotalDays = '';
        let tcTotalDaysMessage = '';

        const maternityDays = clampNonNegative(childrenNum) * 548;
        totalExtensionDays += maternityDays;
        totalExtensionDays += clampNonNegative(addMaternityDays);
        totalExtensionDays += clampNonNegative(parentalDays);

        const nonResearchStart = getDate(startDay, startMonth, startYear);
        const nonResearchEnd = getDate(endDay, endMonth, endYear);
        const hasNonResearchInput = hasAnyDateValue(
            startDay,
            startMonth,
            startYear,
            endDay,
            endMonth,
            endYear
        );

        if (nonResearchStart && nonResearchEnd && nonResearchEnd > nonResearchStart) {
            const days = Math.floor((Math.max(0, toNumber(ftePercent)) / 100) * diffDays(nonResearchEnd, nonResearchStart));
            totalExtensionDays += days;
            fteDays = `(Equivalent to ${days} days)`;
        } else if (hasNonResearchInput) {
            fteDays = status('warning', 'Partial information');
            partialNonResearch = true;
        }

        const tcStart = getDate(tcStartDay, tcStartMonth, tcStartYear);
        const rawTcEnd = getDate(tcEndDay, tcEndMonth, tcEndYear);
        const tcStartHasPartial = hasAnyDateValue(tcStartDay, tcStartMonth, tcStartYear) && !tcStart;
        const tcEndHasPartial = hasAnyDateValue(tcEndDay, tcEndMonth, tcEndYear) && !rawTcEnd;
        const tcHasAnyInput = hasAnyDateValue(
            tcStartDay,
            tcStartMonth,
            tcStartYear,
            tcEndDay,
            tcEndMonth,
            tcEndYear
        );

        if (showTcRows) {
            partialTc = tcStartHasPartial || (!nowInTc && tcEndHasPartial);

            if (tcStart && (nowInTc || rawTcEnd)) {
                let tcEnd = nowInTc || rawTcEnd > MSCA_DEADLINE ? MSCA_DEADLINE : rawTcEnd;
                const tcLowerLimit = new Date(
                    MSCA_DEADLINE.getFullYear() - 1,
                    MSCA_DEADLINE.getMonth(),
                    MSCA_DEADLINE.getDate()
                );
                const tcEndedRecentlyEnough = nowInTc || rawTcEnd > MSCA_DEADLINE || rawTcEnd > tcLowerLimit;
                const tcStartsBeforeEnd = tcEnd > tcStart;

                if (tcEndedRecentlyEnough && tcStartsBeforeEnd) {
                    const eligibleTcStart = tcStart < phdDate ? phdDate : tcStart;
                    const days = Math.max(0, diffDays(tcEnd, eligibleTcStart));
                    tcTotalDays = Math.round(days);
                    totalExtensionDays += days;
                } else if (!partialTc && rawTcEnd && rawTcEnd <= tcLowerLimit) {
                    tcEndTooOld = true;
                }
            } else if (tcHasAnyInput) {
                partialTc = true;
            }

            if (partialTc) {
                tcTotalDaysMessage = status('warning', 'Partial information');
            } else if (tcEndTooOld) {
                tcTotalDaysMessage = status('warning', 'Duration in TC not eligible for extension');
            }
        }

        totalExtensionDays += clampNonNegative(careerBreaks);
        totalExtensionDays += clampNonNegative(nationalService);
        totalExtensionDays += clampNonNegative(sickLeaves);

        const adjustedPhdDate = new Date(phdDate);
        adjustedPhdDate.setDate(adjustedPhdDate.getDate() + Math.round(totalExtensionDays));
        const adjustedYears = formatYears(diffDays(MSCA_DEADLINE, adjustedPhdDate));
        const eligibleAfterExtension = MSCA_PHD_CUTOFF <= adjustedPhdDate;
        const warnings = [];

        if (partialNonResearch) {
            warnings.push('Warning: Partial information about time spent not on research');
        }

        if (partialTc) {
            warnings.push('Warning: Information about time spent in third country is partial');
        }

        return {
            mscaYearsCount: yearsSincePhd,
            maternityLeaveDaysCount:
                maternityDays > 0 ? `(${maternityDays} days of maternity leave)` : '',
            fteDays,
            tcTotalDays,
            tcTotalDaysMessage,
            totalNumberOfExtensionDays: Math.round(totalExtensionDays),
            mscaYearsCountFTE: adjustedYears,
            mscaEligibility: eligibleAfterExtension
                ? baseEligible
                    ? status('eligible', 'Eligible')
                    : status('eligible', 'Eligible (due to extension)')
                : status('blocked', 'Not eligible'),
            warningLineElig: warnings.map((warning, index) => (
                <span key={warning}>
                    {index > 0 && <br />}
                    {status('warning', warning)}
                </span>
            )),
        };
    }, [
        addMaternityDays,
        blockedByPreviousApplication,
        careerBreaks,
        childrenNum,
        endDay,
        endMonth,
        endYear,
        ftePercent,
        nationalService,
        noPhd,
        nowInTc,
        parentalDays,
        phdDate,
        phdDefend,
        showTcRows,
        sickLeaves,
        startDay,
        startMonth,
        startYear,
        tcEndDay,
        tcEndMonth,
        tcEndYear,
        tcStartDay,
        tcStartMonth,
        tcStartYear,
    ]);

    const mobilityCalculation = useMemo(() => {
        if (blockedByPreviousApplication) {
            return {
                totalDaysInDest: '',
                eligibleMobility: '',
                warningLineMobility: '',
            };
        }

        if (haveYouResided === 'no') {
            return {
                totalDaysInDest: 0,
                eligibleMobility: status('eligible', 'Yes'),
                warningLineMobility: '',
            };
        }

        if (haveYouResided !== 'yes') {
            return {
                totalDaysInDest: '',
                eligibleMobility: '',
                warningLineMobility: '',
            };
        }

        const mobilityCutoffDate = new Date(
            MSCA_DEADLINE.getFullYear() - MSCA_YEARS_MOBILITY,
            MSCA_DEADLINE.getMonth(),
            MSCA_DEADLINE.getDate()
        );
        let totalDays = 0;
        let hasIncompleteStay = false;
        let hasTooOldStay = false;
        let hasPartialStay = false;

        mobilityPeriods.forEach((period) => {
            const hasNoInformation = !hasAnyDateValue(
                period.startDay,
                period.startMonth,
                period.startYear,
                period.endDay,
                period.endMonth,
                period.endYear
            );

            if (hasNoInformation) {
                hasIncompleteStay = true;
                return;
            }

            const startDate = getDate(period.startDay, period.startMonth, period.startYear);
            const endDate = getDate(period.endDay, period.endMonth, period.endYear);

            if (!startDate || !endDate || endDate <= startDate) {
                hasIncompleteStay = true;
                hasPartialStay = true;
                return;
            }

            if (endDate < mobilityCutoffDate) {
                hasTooOldStay = true;
                return;
            }

            const relevantStart = startDate < mobilityCutoffDate ? mobilityCutoffDate : startDate;
            totalDays += diffDays(endDate, relevantStart);
        });

        const roundedDays = Math.max(0, Math.round(totalDays));
        const warnings = [];

        if (hasTooOldStay) {
            warnings.push('Some durations are not relevant for mobility considerations');
        }

        if (hasPartialStay) {
            warnings.push('Partial information');
        }

        return {
            totalDaysInDest: roundedDays <= 0 && hasIncompleteStay ? '' : roundedDays,
            eligibleMobility:
                roundedDays >= MSCA_MOBILITY_DAYS_LIMIT
                    ? status('blocked', 'Please consider changing host country')
                    : hasIncompleteStay
                        ? ''
                        : status('eligible', 'Yes'),
            warningLineMobility: warnings.map((warning, index) => (
                <span key={warning}>
                    {index > 0 && <br />}
                    {index > 0 ? status('warning', warning) : warning}
                </span>
            )),
        };
    }, [blockedByPreviousApplication, haveYouResided, mobilityPeriods]);

    const renderDateSelects = ({
        idPrefix,
        day,
        month,
        year,
        setDay,
        setMonth,
        setYear,
        disabled = false,
        emptyValue = '0',
    }) => (
        <div className="flex flex-wrap items-center gap-2">
            <select
                className="date_day"
                name="day"
                id={`${idPrefix}_day`}
                value={day}
                disabled={disabled}
                onChange={(event) => setDay(event.target.value)}
            >
                <option value={emptyValue}>Day</option>
                {daysArray.map((item) => (
                    <option key={`${idPrefix}_day_${item}`} value={item} id={`${idPrefix}_day_${item}`}>
                        {item}
                    </option>
                ))}
            </select>

            <select
                className="date_month"
                name="month"
                id={`${idPrefix}_month`}
                value={month}
                disabled={disabled}
                onChange={(event) => setMonth(event.target.value)}
            >
                <option value={emptyValue}>Month</option>
                {Object.entries(monthArray).map(([num, name]) => (
                    <option key={`${idPrefix}_month_${num}`} value={num} id={`${idPrefix}_month_${num}`}>
                        {name}
                    </option>
                ))}
            </select>

            <select
                className="date_year"
                name="year"
                id={`${idPrefix}_year`}
                value={year}
                disabled={disabled}
                onChange={(event) => setYear(event.target.value)}
            >
                <option value={emptyValue}>Year</option>
                {yearsArray.map((item, index) => (
                    <option key={`${idPrefix}_year_${item}`} value={item} id={`${idPrefix}_year${index + 1}`}>
                        {item}
                    </option>
                ))}
            </select>
        </div>
    );

    return (
        <div className="calculator-container mx-auto my-8 max-w-5xl rounded-lg border border-slate-200 bg-white p-5 text-slate-700 shadow-sm sm:p-8 [&>p]:mb-4 [&>p]:leading-7 [&>p_strong]:text-slate-900 [&_a]:font-semibold [&_a]:text-emerald-700 [&_a]:underline-offset-4 hover:[&_a]:underline [&_.blocked]:font-semibold [&_.blocked]:text-red-700 [&_.eligible]:font-semibold [&_.eligible]:text-emerald-700 [&_.warning]:font-semibold [&_.warning]:text-amber-700 [&_.form_table]:my-6 [&_.form_table]:w-full [&_.form_table]:border-separate [&_.form_table]:border-spacing-0 [&_.form_table]:overflow-hidden [&_.form_table]:rounded-lg [&_.form_table]:border [&_.form_table]:border-slate-200 [&_.form_table]:bg-white [&_.form_table]:text-sm [&_.table_header]:bg-yellow-500 [&_.table_header]:px-4 [&_.table_header]:py-3 [&_.table_header]:text-left [&_.table_header]:text-base [&_.table_header]:font-semibold [&_.table_header]:text-white [&_td]:border-b [&_td]:border-slate-200 [&_td]:px-4 [&_td]:py-3 [&_td]:align-top [&_tr:last-child_td]:border-b-0 [&_.right_border]:border-r [&_.right_border]:border-slate-200 [&_.instructions]:bg-emerald-50/70 [&_.instructions]:text-slate-700 [&_.sub_question]:bg-slate-50 [&_.sub_question]:pl-8 [&_.top_border>td]:border-t-2 [&_.top_border>td]:border-t-slate-300 [&_select]:min-w-28 [&_select]:rounded-md [&_select]:border [&_select]:border-slate-300 [&_select]:bg-white [&_select]:px-3 [&_select]:py-2 [&_select]:text-sm [&_select]:text-slate-800 [&_select]:shadow-sm disabled:[&_select]:cursor-not-allowed disabled:[&_select]:bg-slate-100 disabled:[&_select]:text-slate-400 focus:[&_select]:border-emerald-600 focus:[&_select]:outline-none focus:[&_select]:ring-2 focus:[&_select]:ring-emerald-100 [&_input]:rounded-md [&_input]:border [&_input]:border-slate-300 [&_input]:px-3 [&_input]:py-2 [&_input]:text-sm [&_input]:text-slate-800 [&_input]:shadow-sm disabled:[&_input]:cursor-not-allowed disabled:[&_input]:bg-slate-100 disabled:[&_input]:text-slate-400 focus:[&_input]:border-emerald-600 focus:[&_input]:outline-none focus:[&_input]:ring-2 focus:[&_input]:ring-emerald-100 [&_input[type=checkbox]]:h-4 [&_input[type=checkbox]]:w-4 [&_input[type=checkbox]]:align-middle [&_input[type=checkbox]]:accent-emerald-700 [&_.field]:w-28 [&_.period_button]:mr-2 [&_.period_button]:rounded-md [&_.period_button]:border [&_.period_button]:border-emerald-700 [&_.period_button]:px-4 [&_.period_button]:py-2 [&_.period_button]:text-sm [&_.period_button]:font-semibold [&_.period_button]:text-emerald-800 [&_.period_button]:transition disabled:[&_.period_button]:cursor-not-allowed disabled:[&_.period_button]:border-slate-300 disabled:[&_.period_button]:text-slate-400 hover:[&_.period_button:not(:disabled)]:bg-emerald-50 [&_.note_link]:relative [&_.note_link]:ml-2 [&_.note_link]:inline-flex [&_.note_link]:cursor-help [&_.note_link]:rounded-full [&_.note_link]:bg-emerald-100 [&_.note_link]:px-2 [&_.note_link]:py-0.5 [&_.note_link]:text-xs [&_.note_link]:font-semibold [&_.note_link]:text-emerald-800 [&_.tooltiptext]:invisible [&_.tooltiptext]:absolute [&_.tooltiptext]:left-0 [&_.tooltiptext]:top-full [&_.tooltiptext]:z-20 [&_.tooltiptext]:mt-2 [&_.tooltiptext]:w-72 [&_.tooltiptext]:rounded-lg [&_.tooltiptext]:border [&_.tooltiptext]:border-slate-200 [&_.tooltiptext]:bg-white [&_.tooltiptext]:p-3 [&_.tooltiptext]:text-xs [&_.tooltiptext]:font-normal [&_.tooltiptext]:leading-5 [&_.tooltiptext]:text-slate-700 [&_.tooltiptext]:opacity-0 [&_.tooltiptext]:shadow-lg [&_.tooltiptext]:transition [&_.note_link:hover_.tooltiptext]:visible [&_.note_link:hover_.tooltiptext]:opacity-100 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6">
            <p id="demo"></p>
            <p id="phd_fixed_date_hidden" hidden></p>

            <p>Welcome to Enspire Science&apos;s MSCA-PF eligibility calculator.</p>

            <p>
                <strong>
                    This eligibility calculator was developed to assist researchers in determining their eligibility when applying to the Marie Sklodowska-Curie Actions Post Doctoral Fellowships (MSCA-PF).
                </strong>
            </p>

            <p>
                It applies to the current official MSCA guidelines for assessing the researcher&apos;s eligibility based on their previous MSCA application outcome, research experience and mobility.
            </p>

            <p>Complete the requested data fields below and the calculator will determine your eligibility.</p>

            <p>
                We&apos;ve got a selection of additional services and resources to assist you on your MSCA-PF proposal preparation path. Check them out by clicking below.
                <br />
                <a target="_parent" href="https://enspire.science/grants/prepare-msca-grants/">
                    Learn more <i className="round_button"></i>
                </a>
            </p>

            <table width="100%" className="form_table">
                <tbody id="past_experience_table">
                    <tr className="even">
                        <th colSpan="2" className="table_header">
                            Previous MSCA-PF experience
                        </th>
                    </tr>
                    <tr>
                        <td className="instructions" colSpan="2">
                            As from 2022, resubmission restrictions will apply for applications that received a score below 70% in the previous deadline.
                        </td>
                    </tr>

                    <tr id="past_MSCA_row">
                        <td width="60%" className="right_border">
                            Did you submit an MSCA-PF application in the previous deadline?
                        </td>
                        <td>
                            <div className="flex flex-wrap items-center gap-5">
                                <select
                                    className="past_MSCA"
                                    id="past_MSCA"
                                    name="past_MSCA"
                                    value={pastMSCA}
                                    onChange={(event) => {
                                        setPastMSCA(event.target.value);
                                        if (event.target.value !== 'yes') {
                                            setLowGrade(false);
                                        }
                                    }}
                                >
                                    <option value=""></option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>

                                {pastMSCA === 'yes' && (
                                    <label id="low_grade_span" className="inline-flex items-center gap-2">
                                        Grade below 70%?
                                        <input
                                            type="checkbox"
                                            id="low_grade"
                                            checked={lowGrade}
                                            onChange={(event) => setLowGrade(event.target.checked)}
                                        />
                                    </label>
                                )}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <table width="100%" className="form_table">
                <tbody id="main_table">
                    <tr className="even">
                        <th colSpan="2" className="table_header">
                            Research experience
                        </th>
                    </tr>
                    <tr id="no_award_question"></tr>

                    <tr>
                        <td className="instructions" colSpan="2">
                            Applicants must hold a PhD at the time of the deadline (or have successfully defended their thesis) and must have 8 years or less of research experience relative to the deadline.
                        </td>
                    </tr>

                    <tr>
                        <td width="60%" className="right_border">
                            PhD diploma (or equivalent) award date
                            <a className="note_link">
                                Note
                                <span className="tooltiptext">
                                    In case of multiple diplomas please enter the first one.
                                </span>
                            </a>
                            <br />
                            <label className="mt-3 inline-flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="no_phd"
                                    checked={noPhd}
                                    disabled={blockedByPreviousApplication}
                                    onChange={(event) => setNoPhd(event.target.checked)}
                                />
                                No PhD award yet
                            </label>
                        </td>
                        <td>
                            {renderDateSelects({
                                idPrefix: 'phd',
                                day: phdDay,
                                month: phdMonth,
                                year: phdYear,
                                setDay: setPhdDay,
                                setMonth: setPhdMonth,
                                setYear: setPhdYear,
                                disabled: blockedByPreviousApplication || noPhd,
                            })}
                        </td>
                    </tr>

                    {noPhd && (
                        <tr className="phd_defend">
                            <td className="sub_question right_border">
                                Is the planned defence date before the deadline?<span id="deadline"></span>
                            </td>
                            <td className="sub_question_select">
                                <select
                                    className="phd_defend sub_question_select"
                                    id="phd_defend"
                                    name="phd_defend"
                                    value={phdDefend}
                                    disabled={blockedByPreviousApplication}
                                    onChange={(event) => setPhdDefend(event.target.value)}
                                >
                                    <option value=""></option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </td>
                        </tr>
                    )}

                    <tr>
                        <td className="right_border">Total years of experience</td>
                        <td>
                            <span id="MSCA_years_count">{calculation.mscaYearsCount}</span>
                        </td>
                    </tr>

                    <tr className="even">
                        <th colSpan="2" className="table_header">
                            Extension of eligibility period
                        </th>
                    </tr>
                    <tr>
                        <td colSpan="2" className="instructions">
                            Eligible extensions of the 8-year period may be: maternity leave, paternity leave, long-term illness, national service, career breaks, time not spent on research, or research performed in a third country (for EF only). If relevant, please provide information on eligible extensions below:
                        </td>
                    </tr>

                    <tr>
                        <td className="right_border">
                            <b>Maternity leave:</b> number of children
                            <a className="note_link">
                                Note
                                <span className="tooltiptext">Automatic reduction of 548 days per child.</span>
                            </a>
                        </td>
                        <td>
                            <input
                                className="field leave_days mother"
                                type="number"
                                min="0"
                                value={childrenNum}
                                id="children_num"
                                disabled={extensionFieldsDisabled}
                                onChange={(event) => setChildrenNum(clampNonNegative(event.target.value))}
                            />
                            <span id="maternity_leave_days_count" className="ml-2">
                                {calculation.maternityLeaveDaysCount}
                            </span>
                        </td>
                    </tr>

                    <tr>
                        <td className="right_border">
                            If any of the maternity leave(s) were longer than 548 days, please indicate total number of days beyond 548.
                        </td>
                        <td>
                            <input
                                className="field maternal leave_days"
                                type="number"
                                min="0"
                                value={addMaternityDays}
                                id="add_maternity_days"
                                disabled={extensionFieldsDisabled || clampNonNegative(childrenNum) === 0}
                                onChange={(event) => setAddMaternityDays(clampNonNegative(event.target.value))}
                            />
                        </td>
                    </tr>

                    <tr>
                        <td className="right_border">
                            <b>Parental leave:</b> Number of documented days taken
                        </td>
                        <td>
                            <input
                                className="field other_paternal leave_days"
                                type="number"
                                min="0"
                                value={parentalDays}
                                id="parental_days"
                                disabled={extensionFieldsDisabled}
                                onChange={(event) => setParentalDays(clampNonNegative(event.target.value))}
                            />
                        </td>
                    </tr>

                    <tr className="top_border">
                        <td className="right_border">
                            <b>Time spent not on research:</b>
                        </td>
                        <td></td>
                    </tr>

                    <tr>
                        <td className="right_border sub_question">Start day of employment</td>
                        <td className="sub_question_select">
                            {renderDateSelects({
                                idPrefix: 'start',
                                day: startDay,
                                month: startMonth,
                                year: startYear,
                                setDay: setStartDay,
                                setMonth: setStartMonth,
                                setYear: setStartYear,
                                disabled: extensionFieldsDisabled,
                                emptyValue: '',
                            })}
                        </td>
                    </tr>
                    <tr>
                        <td className="right_border sub_question">End day of employment</td>
                        <td>
                            {renderDateSelects({
                                idPrefix: 'end',
                                day: endDay,
                                month: endMonth,
                                year: endYear,
                                setDay: setEndDay,
                                setMonth: setEndMonth,
                                setYear: setEndYear,
                                disabled: extensionFieldsDisabled,
                                emptyValue: '',
                            })}
                        </td>
                    </tr>

                    <tr>
                        <td className="right_border sub_question">% Full Time Equivalent spent not on research</td>
                        <td className="sub_question_select">
                            <input
                                className="field leave_days"
                                type="number"
                                min="0"
                                max="100"
                                value={ftePercent}
                                id="FTE_percent"
                                disabled={extensionFieldsDisabled}
                                onChange={(event) => setFtePercent(clampNonNegative(event.target.value))}
                            />
                            <span className="ml-1">%</span>
                            <span id="fte_days" className="ml-2">
                                {calculation.fteDays}
                            </span>
                        </td>
                    </tr>

                    <tr className="top_border">
                        <td className="right_border">
                            <b>Research experience in a non-associated Third Country</b>
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className="right_border">
                            Nationals and long-term residents of a Member State or an Associated Country who reintegrate in Europe are eligible for deduction of the time spent performing research in a third country (TC). <b>This is relevant only for the European Fellowship.</b>
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className="right_border">Do you intend to apply for a European Fellowship?</td>
                        <td>
                            <select
                                id="is_europe"
                                className="leave_days"
                                value={isEurope}
                                disabled={extensionFieldsDisabled}
                                onChange={(event) => setIsEurope(event.target.value)}
                            >
                                <option value=""></option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </td>
                    </tr>

                    {showEuropeanRow && (
                        <tr className="europe_row">
                            <td className="right_border">
                                Are you a European national/long-term resident who spent time in research in a non-associated third country?
                            </td>
                            <td>
                                <select
                                    id="tc_research"
                                    className="leave_days non_eu_days"
                                    name="tc_research"
                                    value={tcResearch}
                                    disabled={extensionFieldsDisabled}
                                    onChange={(event) => setTcResearch(event.target.value)}
                                >
                                    <option value=""></option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </td>
                        </tr>
                    )}

                    {showTcRows && (
                        <>
                            <tr className="tc_row">
                                <td className="right_border sub_question">Start of research duration</td>
                                <td id="tc_start">
                                    {renderDateSelects({
                                        idPrefix: 'tc_start',
                                        day: tcStartDay,
                                        month: tcStartMonth,
                                        year: tcStartYear,
                                        setDay: setTcStartDay,
                                        setMonth: setTcStartMonth,
                                        setYear: setTcStartYear,
                                        disabled: extensionFieldsDisabled,
                                    })}
                                </td>
                            </tr>

                            <tr className="tc_row">
                                <td className="right_border sub_question">End of research duration</td>
                                <td id="tc_end">
                                    <div className="flex flex-wrap items-center gap-3">
                                        {renderDateSelects({
                                            idPrefix: 'tc_end',
                                            day: tcEndDay,
                                            month: tcEndMonth,
                                            year: tcEndYear,
                                            setDay: setTcEndDay,
                                            setMonth: setTcEndMonth,
                                            setYear: setTcEndYear,
                                            disabled: extensionFieldsDisabled || nowInTc,
                                        })}
                                        <label className="inline-flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="now_in_tc"
                                                checked={nowInTc}
                                                disabled={extensionFieldsDisabled}
                                                onChange={(event) => setNowInTc(event.target.checked)}
                                            />
                                            Still in TC
                                        </label>
                                    </div>
                                </td>
                            </tr>

                            <tr className="tc_row">
                                <td className="right_border sub_question">Total number of eligible days</td>
                                <td>
                                    <span id="tc_total_days">{calculation.tcTotalDays}</span>
                                    <span id="tc_total_days_message" className="ml-2">
                                        {calculation.tcTotalDaysMessage}
                                    </span>
                                </td>
                            </tr>
                        </>
                    )}

                    <tr className="top_border">
                        <td className="right_border">Career breaks (in days)</td>
                        <td>
                            <input
                                className="field leave_days"
                                type="number"
                                min="0"
                                value={careerBreaks}
                                id="career_breaks"
                                disabled={extensionFieldsDisabled}
                                onChange={(event) => setCareerBreaks(clampNonNegative(event.target.value))}
                            />
                        </td>
                    </tr>

                    <tr>
                        <td className="right_border">National service (in days)</td>
                        <td>
                            <input
                                className="field leave_days"
                                type="number"
                                min="0"
                                value={nationalService}
                                id="national_service"
                                disabled={extensionFieldsDisabled}
                                onChange={(event) => setNationalService(clampNonNegative(event.target.value))}
                            />
                        </td>
                    </tr>

                    <tr>
                        <td className="right_border">
                            Long-term sick leaves (in days)
                            <a className="note_link">
                                Note<span className="tooltiptext">&gt; 30 days</span>
                            </a>
                        </td>
                        <td>
                            <input
                                className="field leave_days"
                                type="number"
                                min="0"
                                value={sickLeaves}
                                id="sick_leaves"
                                disabled={extensionFieldsDisabled}
                                onChange={(event) => setSickLeaves(clampNonNegative(event.target.value))}
                            />
                        </td>
                    </tr>

                    <tr className="top_border">
                        <td className="right_border">Eligible extension (in days):</td>
                        <td>
                            <span id="total_number_of_extension_days">
                                {calculation.totalNumberOfExtensionDays}
                            </span>
                        </td>
                    </tr>

                    <tr>
                        <td className="right_border">Research experience after extension (in years):</td>
                        <td>
                            <span id="MSCA_years_count_FTE">{calculation.mscaYearsCountFTE}</span>
                        </td>
                    </tr>

                    <tr>
                        <td className="right_border">Eligibility after extension:</td>
                        <td>
                            <span id="MSCA_elegibility">{calculation.mscaEligibility}</span>
                        </td>
                    </tr>
                    <tr>
                        <td className="right_border"></td>
                        <td id="warning_line_elig">{calculation.warningLineElig}</td>
                    </tr>
                </tbody>
            </table>

            <table width="100%" className="form_table">
                <tbody>
                    <tr className="even">
                        <th className="table_header" colSpan="2">
                            Mobility
                        </th>
                    </tr>
                    <tr>
                        <td colSpan="2" className="instructions">
                            The mobility requirements in MSCA-PF state that the researcher cannot have resided or carried out their main activity (work, studies, etc.) in the country of the beneficiary (for European Postdoctoral Fellowships), or the host organization for the outgoing phase (for Global Postdoctoral Fellowships), for more than 12 months in the 36 months immediately prior to the call deadline. The calculator below will help you determine your eligibility in regard to the mobility criterion.
                        </td>
                    </tr>
                    <tr>
                        <td className="right_border">
                            Have you resided or carried out your main activity in the country of the beneficiary (EF), or the host organization for the outgoing phase (for GF) in the 36 months immediately prior to the deadline?
                            <a className="note_link">
                                Note
                                <span className="tooltiptext">
                                    Please note that compulsory national service, time spent as part of a procedure for obtaining refugee status under the Geneva Convention, and short stays such as holidays are not taken into account.
                                </span>
                            </a>
                        </td>
                        <td>
                            <select
                                id="have_you_resided"
                                value={haveYouResided}
                                disabled={blockedByPreviousApplication}
                                onChange={(event) => setHaveYouResided(event.target.value)}
                            >
                                <option value=""></option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </td>
                    </tr>

                    {showMobilityPeriods &&
                        mobilityPeriods.map((period, index) => (
                            <Fragment key={period.id}>
                                <tr className="mobility" id={`mob_period_row_start_${period.id}`}>
                                    <td className="right_border">Start of stay {index + 1} in host country</td>
                                    <td>
                                        {renderDateSelects({
                                            idPrefix: `duration_in_dest${period.id}_start`,
                                            day: period.startDay,
                                            month: period.startMonth,
                                            year: period.startYear,
                                            setDay: (value) => updateMobilityPeriod(period.id, 'startDay', value),
                                            setMonth: (value) => updateMobilityPeriod(period.id, 'startMonth', value),
                                            setYear: (value) => updateMobilityPeriod(period.id, 'startYear', value),
                                        })}
                                    </td>
                                </tr>
                                <tr className="mobility" id={`mob_period_row_end_${period.id}`}>
                                    <td className="right_border">End of stay {index + 1} in host country</td>
                                    <td>
                                        {renderDateSelects({
                                            idPrefix: `duration_in_dest${period.id}_end`,
                                            day: period.endDay,
                                            month: period.endMonth,
                                            year: period.endYear,
                                            setDay: (value) => updateMobilityPeriod(period.id, 'endDay', value),
                                            setMonth: (value) => updateMobilityPeriod(period.id, 'endMonth', value),
                                            setYear: (value) => updateMobilityPeriod(period.id, 'endYear', value),
                                        })}
                                    </td>
                                </tr>
                            </Fragment>
                        ))}

                    <tr id="add_duration_here" style={{ display: 'none' }}>
                        <td></td>
                        <td hidden id="n_durations">
                            {mobilityPeriods.length}
                        </td>
                    </tr>

                    {showMobilityPeriods && (
                        <tr>
                            <td className="right_border">
                                <button
                                    id="add_period_button"
                                    className="period_button mobility"
                                    type="button"
                                    onClick={addPeriodMobility}
                                >
                                    Add period
                                </button>
                                <button
                                    id="remove_period_button"
                                    className="period_button mobility"
                                    type="button"
                                    onClick={removePeriodMobility}
                                    disabled={mobilityPeriods.length === 1}
                                >
                                    Remove period
                                </button>
                            </td>
                            <td></td>
                        </tr>
                    )}
                    <tr>
                        <td width="60%" className="right_border">
                            Total number of days in host country in the 36 months prior to the deadline
                        </td>
                        <td>
                            <span id="total_days_in_dest">{mobilityCalculation.totalDaysInDest}</span>
                        </td>
                    </tr>
                    <tr>
                        <td className="right_border">Mobility criterion answered?</td>
                        <td id="eligible_mobility">{mobilityCalculation.eligibleMobility}</td>
                    </tr>
                    <tr>
                        <td className="right_border"></td>
                        <td id="warning_line_mobility">{mobilityCalculation.warningLineMobility}</td>
                    </tr>
                </tbody>
            </table>

            <h2>Disclaimers</h2>
            <ol>
                <li>This calculator is available for use for free.</li>
                <li>Enspire Science Ltd. is not liable for any decision or other act made based on any use of this calculator.</li>
                <li>This calculator is <b>not</b> an official calculator of the European Commission and should not be regarded as such.</li>
                <li>The official references are the published MSCA-PF work programme and the MSCA-PF Guide for Applicants.</li>
                <li>This calculator was developed and is owned by Enspire Science Ltd. As such it is protected by copyright laws.</li>
            </ol>
        </div>
    );
}
