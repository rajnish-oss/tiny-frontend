"use client";

import { useMemo, useState } from "react";

type Source = "LinkedIn" | "Indeed" | "Naukri" | "Internshala" | "Company sites";
type JobId = string | number;
type Job = {
  id: JobId; title: string; company: string; location: string; workType: string;
  seniority: string; salary: string; posted: string; source: string;
  url: string; keywords: string[]; matchScore: number; description: { about: string[]; requirements: string[]; perks: string[] };
};

type ApiJob = {
  id: string | number;
  title?: string;
  company?: string;
  location?: string;
  type?: string;
  seniority?: string;
  snippet?: string;
  apply_url?: string;
  source?: string;
  posted_date?: string;
  relevance_score?: number;
};

type SearchResponse = { jobs: ApiJob[]; error?: string; detail?: string };
type ResumeData = {
  role?: string;
  alternate_roles?: string[];
  location?: string | null;
  open_to_remote?: boolean;
  seniority?: string;
  keywords?: string[];
  sources?: string[];
  detail?: string;
};

const sources: Source[] = ["LinkedIn", "Indeed", "Naukri", "Internshala", "Company sites"];
const roles = ["Frontend Developer", "Data Analyst", "Marketing Executive", "Product Designer", "Software Engineer"];
const locations = ["Bengaluru", "Mumbai", "Delhi NCR", "Hyderabad", "Remote"];
const demoJobs: Job[] = [
  { id: 1, title: "Frontend Developer", company: "Razorpay", location: "Bengaluru", workType: "Hybrid", seniority: "Mid", salary: "₹14–20 LPA", posted: "2 days ago", source: "LinkedIn", url: "https://www.linkedin.com/jobs/", keywords: ["React", "TypeScript", "Next.js"], matchScore: 92, description: { about: ["Build thoughtful, high-performance experiences for millions of businesses.", "Partner closely with product and design to ship elegant interfaces."], requirements: ["3+ years with React and TypeScript", "Strong understanding of web performance"], perks: ["Flexible hybrid work", "Learning and wellness budget"] } },
  { id: 2, title: "Product Designer", company: "CRED", location: "Mumbai", workType: "On-site", seniority: "Mid", salary: "₹18–25 LPA", posted: "1 day ago", source: "Company sites", url: "https://careers.cred.club/", keywords: ["Figma", "Product design", "UX"], matchScore: 88, description: { about: ["Shape delightful financial products used by a design-conscious community."], requirements: ["A strong product design portfolio", "Experience taking ideas from concept to launch"], perks: ["Work with a world-class design team"] } },
  { id: 3, title: "Data Analyst", company: "Meesho", location: "Bengaluru", workType: "Hybrid", seniority: "Entry", salary: "₹8–12 LPA", posted: "3 days ago", source: "Indeed", url: "https://in.indeed.com/", keywords: ["SQL", "Python", "Tableau"], matchScore: 86, description: { about: ["Turn marketplace data into decisions that make online shopping more accessible."], requirements: ["Proficiency in SQL", "Comfort presenting insights to stakeholders"], perks: ["Mentorship and growth tracks"] } },
  { id: 4, title: "Software Engineer, Frontend", company: "PhonePe", location: "Bengaluru", workType: "On-site", seniority: "Senior", salary: "₹24–35 LPA", posted: "5 days ago", source: "Naukri", url: "https://www.naukri.com/", keywords: ["React", "JavaScript", "Testing"], matchScore: 84, description: { about: ["Help build reliable payment experiences at extraordinary scale."], requirements: ["5+ years building production web apps", "Testing and accessibility mindset"], perks: ["High ownership and impact"] } },
  { id: 5, title: "Marketing Executive", company: "Wakefit", location: "Remote", workType: "Remote", seniority: "Entry", salary: "₹6–9 LPA", posted: "6 days ago", source: "Internshala", url: "https://internshala.com/", keywords: ["SEO", "Content", "Growth"], matchScore: 79, description: { about: ["Bring a customer-first home brand to more people through smart, creative marketing."], requirements: ["1–2 years in digital marketing", "Strong writing and reporting skills"], perks: ["Remote-first team", "Product discounts"] } },
  { id: 6, title: "Frontend Engineer", company: "Groww", location: "Bengaluru", workType: "Hybrid", seniority: "Senior", salary: "₹22–30 LPA", posted: "1 week ago", source: "LinkedIn", url: "https://www.linkedin.com/jobs/", keywords: ["React", "TypeScript", "CSS"], matchScore: 77, description: { about: ["Create simple investing products for the next 100 million Indians."], requirements: ["Deep React expertise", "Experience with design systems"], perks: ["Hybrid work and ESOPs"] } },
  { id: 7, title: "Business Analyst", company: "Deloitte", location: "Hyderabad", workType: "Hybrid", seniority: "Entry", salary: "₹7–11 LPA", posted: "2 days ago", source: "Indeed", url: "https://in.indeed.com/", keywords: ["Excel", "SQL", "Analytics"], matchScore: 74, description: { about: ["Help clients solve complex operational challenges with data."], requirements: ["Analytical problem solving", "Clear communication"], perks: ["Structured learning program"] } },
  { id: 8, title: "UX Design Intern", company: "Swiggy", location: "Bengaluru", workType: "On-site", seniority: "Intern", salary: "₹35k–50k / month", posted: "4 days ago", source: "Internshala", url: "https://internshala.com/", keywords: ["Figma", "UX", "Research"], matchScore: 71, description: { about: ["Learn from a curious design team while making everyday moments easier."], requirements: ["Portfolio or case studies", "Curiosity and attention to detail"], perks: ["Internship certificate and mentorship"] } },
  { id: 9, title: "SEO & Content Specialist", company: "Urban Company", location: "Delhi NCR", workType: "Remote", seniority: "Mid", salary: "₹10–15 LPA", posted: "1 week ago", source: "Naukri", url: "https://www.naukri.com/", keywords: ["SEO", "Content", "Analytics"], matchScore: 68, description: { about: ["Own organic growth across home and beauty services."], requirements: ["Hands-on SEO experience", "Excellent editorial judgment"], perks: ["Remote-friendly culture"] } },
  { id: 10, title: "Product Manager", company: "Zomato", location: "Gurugram", workType: "Hybrid", seniority: "Senior", salary: "₹28–40 LPA", posted: "2 weeks ago", source: "Company sites", url: "https://www.zomato.com/careers", keywords: ["Product", "Analytics", "Strategy"], matchScore: 64, description: { about: ["Own products that delight millions of food lovers."], requirements: ["5+ years product experience", "Strong analytical thinking"], perks: ["High-impact ownership"] } },
  { id: 11, title: "React Developer", company: "Myntra", location: "Bengaluru", workType: "On-site", seniority: "Mid", salary: "₹15–22 LPA", posted: "3 days ago", source: "Naukri", url: "https://www.naukri.com/", keywords: ["React", "Redux", "JavaScript"], matchScore: 62, description: { about: ["Build fashion discovery experiences at scale."], requirements: ["Strong JavaScript fundamentals", "React production experience"], perks: ["Employee shopping benefits"] } },
  { id: 12, title: "Growth Marketing Intern", company: "Lenskart", location: "Delhi NCR", workType: "Hybrid", seniority: "Intern", salary: "₹20k–30k / month", posted: "5 days ago", source: "Internshala", url: "https://internshala.com/", keywords: ["Marketing", "SEO", "Growth"], matchScore: 59, description: { about: ["Support campaigns that make eyewear more accessible."], requirements: ["Strong communication", "Interest in performance marketing"], perks: ["Guidance from growth leaders"] } },
  { id: 13, title: "Data Scientist", company: "Flipkart", location: "Bengaluru", workType: "Hybrid", seniority: "Senior", salary: "₹30–45 LPA", posted: "1 week ago", source: "LinkedIn", url: "https://www.linkedin.com/jobs/", keywords: ["Python", "SQL", "Machine learning"], matchScore: 57, description: { about: ["Solve interesting problems across India's largest marketplace."], requirements: ["Strong Python and statistics", "Applied ML experience"], perks: ["Scale, autonomy, and impact"] } },
  { id: 14, title: "Content Marketing Manager", company: "Mindtickle", location: "Remote", workType: "Remote", seniority: "Lead", salary: "₹18–26 LPA", posted: "2 weeks ago", source: "Company sites", url: "https://www.mindtickle.com/careers/", keywords: ["Content", "B2B", "SEO"], matchScore: 54, description: { about: ["Tell the story of a category-defining revenue enablement platform."], requirements: ["6+ years in B2B content", "Excellent writing and editing"], perks: ["Distributed global team"] } },
  { id: 15, title: "Junior UI Engineer", company: "Ather Energy", location: "Bengaluru", workType: "On-site", seniority: "Entry", salary: "₹9–13 LPA", posted: "10 days ago", source: "Indeed", url: "https://in.indeed.com/", keywords: ["HTML", "CSS", "JavaScript"], matchScore: 51, description: { about: ["Make the future of urban mobility feel as good as it works."], requirements: ["Strong HTML and CSS", "Passion for polished details"], perks: ["Work on meaningful products"] } },
  { id: 16, title: "Product Operations Associate", company: "Zepto", location: "Mumbai", workType: "Hybrid", seniority: "Entry", salary: "₹7–10 LPA", posted: "3 weeks ago", source: "LinkedIn", url: "https://www.linkedin.com/jobs/", keywords: ["Operations", "Analytics", "Excel"], matchScore: 48, description: { about: ["Improve the systems behind India's fastest delivery experience."], requirements: ["Structured problem solving", "Comfort with data"], perks: ["Fast-growth environment"] } },
  { id: 17, title: "Lead Backend Engineer", company: "Jupiter", location: "Remote", workType: "Remote", seniority: "Lead", salary: "₹35–48 LPA", posted: "2 weeks ago", source: "Company sites", url: "https://jupiter.money/careers", keywords: ["Node.js", "AWS", "Backend"], matchScore: 45, description: { about: ["Build secure banking infrastructure for modern India."], requirements: ["8+ years in backend engineering", "Distributed systems experience"], perks: ["Remote-first and generous leave"] } },
  { id: 18, title: "Customer Success Executive", company: "NoBroker", location: "Mumbai", workType: "On-site", seniority: "Entry", salary: "₹5–8 LPA", posted: "3 weeks ago", source: "Indeed", url: "https://in.indeed.com/", keywords: ["Customer success", "Communication", "CRM"], matchScore: 41, description: { about: ["Help customers find their next home with confidence."], requirements: ["Empathy and clear communication", "Comfort with CRM tools"], perks: ["Performance bonuses"] } }
];

const apiBaseUrl = (process.env.API_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");
const portalDomains: Record<Exclude<Source, "Company sites">, string> = {
  LinkedIn: "linkedin.com/jobs",
  Indeed: "indeed.com",
  Naukri: "naukri.com",
  Internshala: "internshala.com",
};

function normalizeJob(job: ApiJob, keywords: string[]): Job {
  const type = job.type?.toLowerCase() ?? "";
  const workType = type.includes("remote") ? "Remote" : type.includes("hybrid") ? "Hybrid" : "On-site";
  const snippet = job.snippet?.trim() || "No job description was provided.";

  return {
    id: String(job.id),
    title: job.title || "Untitled role",
    company: job.company || "Company not listed",
    location: job.location || "Location not listed",
    workType,
    seniority: job.seniority || "Not specified",
    salary: "Not listed",
    posted: job.posted_date || "Recently",
    source: job.source || "Web",
    url: job.apply_url || "#",
    keywords,
    matchScore: Math.round(job.relevance_score ?? 0),
    description: {
      about: [snippet],
      requirements: ["See the original posting for full requirements."],
      perks: ["See the original posting for benefits and perks."],
    },
  };
}

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const paths: Record<string, string> = { search: "M11 19a8 8 0 1 1 5.657-2.343L21 21M16.657 16.657 21 21", bookmark: "M5 4.5A2.5 2.5 0 0 1 7.5 2h9A2.5 2.5 0 0 1 19 4.5V22l-7-4-7 4V4.5Z", arrow: "M5 12h14m-6-6 6 6-6 6", external: "M14 3h7v7m0-7L12 12M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6", share: "M18 8a3 3 0 1 0-2.83-4A3 3 0 0 0 18 8ZM6 15a3 3 0 1 0 2.83 4A3 3 0 0 0 6 15Zm12 1a3 3 0 1 0-2.83 4A3 3 0 0 0 18 16ZM8.6 16.5l6.8-3.8M15.4 11.3 8.6 7.5", close: "M6 6l12 12M18 6 6 18", back: "M19 12H5m7 7-7-7 7-7", chevron: "m6 9 6 6 6-6" };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}

function JobCard({ job, selected, saved, applied, onSelect, onSave }: { job: Job; selected: boolean; saved: boolean; applied: boolean; onSelect: () => void; onSave: () => void }) {
  return <article onClick={onSelect} className={`group relative cursor-pointer border bg-white p-4 transition hover:border-[#9fc5ea] ${selected ? "border-l-[3px] border-l-brand border-t-[#d7e3ef] border-r-[#d7e3ef] border-b-[#d7e3ef]" : "border-slate-200"} rounded-lg`}>
    <div className="flex gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#e8f1fb] text-sm font-bold text-brand">{job.company[0]}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2"><h3 className="font-semibold leading-5 text-ink">{job.title}</h3><button aria-label={saved ? "Remove saved job" : "Save job"} onClick={(event) => { event.stopPropagation(); onSave(); }} className={`rounded p-1.5 ${saved ? "text-brand" : "text-slate-400 hover:text-brand"}`}><Icon name="bookmark" size={18} /></button></div>
        <p className="mt-1 text-sm font-medium text-slate-600">{job.company}</p>
        <p className="mt-2 text-sm text-muted">{job.location} · {job.workType}</p>
        <p className="mt-2 text-sm font-medium text-ink">{job.salary}</p>
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs"><span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">{job.seniority}</span><span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">{job.posted}</span><span className="rounded-full bg-[#eef6ff] px-2 py-1 text-brand">via {job.source}</span>{applied && <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">Applied</span>}</div>
      </div>
      <div className={`absolute right-4 top-4 text-xs font-semibold ${job.matchScore > 80 ? "text-emerald-600" : job.matchScore > 60 ? "text-amber-600" : "text-slate-500"}`}>{job.matchScore}% match</div>
    </div>
  </article>;
}

function SearchPanel({ role, setRole, location, setLocation, seniority, setSeniority, keywords, setKeywords, remote, setRemote, selectedSources, setSelectedSources, onSearch, isLoading }: any) {
  const [keywordInput, setKeywordInput] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const addKeyword = () => { const clean = keywordInput.trim(); if (clean && !keywords.includes(clean)) setKeywords([...keywords, clean]); setKeywordInput(""); };
  const toggleSource = (source: Source) => setSelectedSources(selectedSources.includes(source) ? selectedSources.filter((item: Source) => item !== source) : [...selectedSources, source]);
  return <section className="border border-slate-200 bg-white p-4 shadow-card sm:p-5">
    <div className="grid gap-3 lg:grid-cols-[1.2fr_1.1fr_1fr]">
      <label className="relative block"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Role</span><div className="relative"><Icon name="search" size={17} /><input value={role} onChange={(e) => setRole(e.target.value)} list="role-options" placeholder="e.g. Frontend Developer" className="h-11 w-full rounded-md border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100" /></div><datalist id="role-options">{roles.map((item) => <option key={item}>{item}</option>)}</datalist></label>
      <label><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Location</span><input value={location} onChange={(e) => setLocation(e.target.value)} list="location-options" placeholder="City or remote" className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100" /><datalist id="location-options">{locations.map((item) => <option key={item}>{item}</option>)}</datalist></label>
      <div className="flex items-end gap-3"><label className="flex-1"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Seniority</span><select value={seniority} onChange={(e) => setSeniority(e.target.value)} className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"><option value="">All levels</option>{["Intern", "Entry", "Mid", "Senior", "Lead"].map((item) => <option key={item}>{item}</option>)}</select></label><button onClick={() => setRemote(!remote)} className={`mb-0 flex h-11 items-center gap-2 rounded-md border px-3 text-sm font-medium ${remote ? "border-brand bg-blue-50 text-brand" : "border-slate-300 text-slate-600"}`}><span className={`h-3 w-3 rounded-full border ${remote ? "border-brand bg-brand" : "border-slate-400"}`} />Remote</button></div>
    </div>
    <button className="mt-4 flex items-center gap-2 text-sm font-semibold text-brand lg:hidden" onClick={() => setFiltersOpen(!filtersOpen)}>Filters <span className="text-xs">{filtersOpen ? "−" : "+"}</span></button>
    <div className={`${filtersOpen ? "block" : "hidden"} mt-4 border-t border-slate-100 pt-4 lg:block`}>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_1.8fr_auto] lg:items-end">
        <label><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Keywords</span><div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-md border border-slate-300 px-2 py-1 focus-within:border-brand focus-within:ring-2 focus-within:ring-blue-100">{keywords.map((keyword: string) => <button key={keyword} onClick={() => setKeywords(keywords.filter((item: string) => item !== keyword))} className="flex items-center gap-1 rounded bg-blue-50 px-2 py-1 text-xs font-medium text-brand">{keyword}<Icon name="close" size={13} /></button>)}<input value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())} placeholder={keywords.length ? "Add more..." : "React, SQL, SEO"} className="min-w-24 flex-1 border-0 px-1 py-1 text-sm outline-none" /></div></label>
        <div><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Sources</span><div className="flex flex-wrap gap-2">{sources.map((source) => <button key={source} onClick={() => toggleSource(source)} className={`rounded-full border px-3 py-2 text-xs font-medium ${selectedSources.includes(source) ? "border-blue-200 bg-blue-50 text-brand" : "border-slate-200 text-slate-500"}`}><span className="mr-1">{selectedSources.includes(source) ? "✓" : "+"}</span>{source}</button>)}</div></div>
        <button disabled={isLoading} onClick={onSearch} className="h-11 rounded-md bg-brand px-5 text-sm font-semibold text-white hover:bg-[#084f96] focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-wait disabled:opacity-70">{isLoading ? "Searching…" : <>Search jobs <span className="ml-1">→</span></>}</button>
      </div>
    </div>
  </section>;
}

function ResumeUpload({ fileName, isParsing, status, error, onFileChange }: { fileName: string; isParsing: boolean; status: string; error: string; onFileChange: (file: File | null) => void }) {
  return <section className="mt-4 rounded-lg border border-dashed border-blue-200 bg-blue-50/50 p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
    <div><p className="text-sm font-semibold text-ink">Make your search more personal</p><p className="mt-1 text-xs text-muted">Upload a PDF resume to prefill your role, skills, seniority, and location.</p>{status && <p className="mt-2 text-xs font-medium text-emerald-700">{status}</p>}{error && <p role="alert" className="mt-2 text-xs font-medium text-red-700">{error}</p>}</div>
    <label className="mt-3 inline-flex cursor-pointer items-center justify-center rounded-md border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-brand hover:border-brand sm:mt-0">
      {isParsing ? "Parsing resume…" : fileName || "Upload resume"}
      <input type="file" accept="application/pdf,.pdf" disabled={isParsing} className="sr-only" onChange={(event) => onFileChange(event.target.files?.[0] ?? null)} />
    </label>
  </section>;
}

function LoadingResults() {
  return <div className="space-y-2" aria-live="polite" aria-label="Searching for jobs">
    <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-brand">Searching live job listings. This can take a moment while sources are checked.</div>
    {[1, 2, 3].map((item) => <div key={item} className="animate-pulse rounded-lg border border-slate-200 bg-white p-4"><div className="h-4 w-2/5 rounded bg-slate-200" /><div className="mt-3 h-3 w-1/4 rounded bg-slate-100" /><div className="mt-5 h-3 w-4/5 rounded bg-slate-100" /></div>)}
  </div>;
}

function Detail({ job, saved, applied, onSave, onApply, onClose }: { job: Job; saved: boolean; applied: boolean; onSave: () => void; onApply: () => void; onClose: () => void }) {
  const [applyPrompt, setApplyPrompt] = useState(false);
  const doApply = () => { window.open(job.url, "_blank", "noopener,noreferrer"); setApplyPrompt(true); };
  return <div className="fade-in flex h-full flex-col overflow-y-auto bg-white">
    <div className="flex items-center justify-between border-b border-slate-200 p-5"><button onClick={onClose} className="flex items-center gap-2 text-sm font-medium text-muted lg:hidden"><Icon name="back" size={18} />Back to jobs</button><span className="hidden text-xs font-semibold uppercase tracking-wide text-muted lg:block">Job details</span><button aria-label="Close details" onClick={onClose} className="rounded p-1 text-slate-400 hover:text-ink lg:hidden"><Icon name="close" /></button></div>
    <div className="p-5 sm:p-6"><div className="flex gap-3"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#e8f1fb] text-lg font-bold text-brand">{job.company[0]}</div><div><h2 className="text-xl font-bold tracking-tight text-ink">{job.title}</h2><p className="mt-1 font-medium text-slate-600">{job.company}</p><p className="mt-2 text-sm text-muted">{job.location} · {job.workType} · {job.posted}</p></div></div>
      <div className="mt-5 flex flex-wrap gap-2"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{job.seniority}</span><span className="rounded-full bg-[#eef6ff] px-2.5 py-1 text-xs font-medium text-brand">via {job.source}</span><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">{job.matchScore}% match</span></div>
      <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50/60 p-4"><h3 className="text-sm font-semibold text-ink">Why it matches</h3><ul className="mt-2 space-y-1.5 text-sm text-slate-600"><li>✓ Matches your keywords: {job.keywords.slice(0, 2).join(", ")}</li><li>✓ Seniority fits: {job.seniority}</li><li>✓ Location: {job.location}</li></ul></div>
      <div className="mt-7 space-y-6 text-sm leading-6 text-slate-600"><section><h3 className="mb-2 font-semibold text-ink">About the role</h3><ul className="list-disc space-y-1 pl-5">{job.description.about.map((item) => <li key={item}>{item}</li>)}</ul></section><section><h3 className="mb-2 font-semibold text-ink">Requirements</h3><ul className="list-disc space-y-1 pl-5">{job.description.requirements.map((item) => <li key={item}>{item}</li>)}</ul></section><section><h3 className="mb-2 font-semibold text-ink">Perks</h3><ul className="list-disc space-y-1 pl-5">{job.description.perks.map((item) => <li key={item}>{item}</li>)}</ul></section></div>
      <div className="mt-8 flex flex-wrap gap-2"><button onClick={doApply} className="flex h-11 items-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-white hover:bg-[#084f96]">{applied ? "Applied" : `Apply on ${job.source === "Company sites" ? "company site" : job.source}`}<Icon name="external" size={15} /></button><button onClick={onSave} className="flex h-11 items-center gap-2 rounded-md border border-slate-300 px-4 text-sm font-semibold text-ink hover:border-brand hover:text-brand"><Icon name="bookmark" size={16} />{saved ? "Saved" : "Save"}</button><button onClick={() => navigator.clipboard?.writeText(job.url)} aria-label="Share job" className="flex h-11 items-center gap-2 rounded-md border border-slate-300 px-3 text-sm font-semibold text-ink hover:border-brand hover:text-brand"><Icon name="share" size={16} />Share</button></div>
      {applyPrompt && !applied && <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm"><div className="font-medium text-ink">Did you apply?</div><div className="mt-2 flex gap-2"><button onClick={onApply} className="rounded border border-brand bg-white px-3 py-1.5 text-xs font-semibold text-brand">Yes, I applied</button><button onClick={() => setApplyPrompt(false)} className="rounded px-3 py-1.5 text-xs font-medium text-muted hover:bg-white">Not yet</button></div></div>}</div>
  </div>;
}

export default function Home() {
  const [role, setRole] = useState("Frontend Developer"); const [location, setLocation] = useState(""); const [seniority, setSeniority] = useState(""); const [keywords, setKeywords] = useState<string[]>(["React"]); const [remote, setRemote] = useState(false); const [selectedSources, setSelectedSources] = useState<Source[]>(sources); const [selectedId, setSelectedId] = useState<JobId | null>(null); const [savedIds, setSavedIds] = useState<JobId[]>([3, 6]); const [appliedIds, setAppliedIds] = useState<JobId[]>([]); const [activePage, setActivePage] = useState<"Jobs" | "Saved">("Jobs"); const [sort, setSort] = useState("Best match"); const [searched, setSearched] = useState(false); const [jobResults, setJobResults] = useState<Job[]>(demoJobs); const [isLoading, setIsLoading] = useState(false); const [error, setError] = useState(""); const [resumeName, setResumeName] = useState(""); const [isParsingResume, setIsParsingResume] = useState(false); const [resumeStatus, setResumeStatus] = useState(""); const [resumeError, setResumeError] = useState("");
  const sourceIsSelected = (source: string) => selectedSources.some((selected) => selected === source || (selected === "Company sites" && !Object.keys(portalDomains).includes(source)));
  const filteredJobs = useMemo(() => { let result = jobResults.filter((job) => sourceIsSelected(job.source) && (!remote || job.workType === "Remote") && (activePage !== "Saved" || savedIds.includes(job.id))); return [...result].sort((a, b) => sort === "Newest" ? a.posted.localeCompare(b.posted) : sort === "Highest pay" ? b.salary.localeCompare(a.salary) : b.matchScore - a.matchScore); }, [activePage, jobResults, remote, savedIds, selectedSources, sort]);
  const selectedJob = selectedId === null ? undefined : filteredJobs.find((job) => job.id === selectedId) || filteredJobs[0];
  const toggleSaved = (id: JobId) => setSavedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const parseResume = async (file: File | null) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) { setResumeError("Please choose a PDF resume."); return; }
    setResumeName(file.name); setResumeStatus(""); setResumeError(""); setIsParsingResume(true);
    try {
      const formData = new FormData(); formData.append("resume", file);
      const response = await fetch(`${apiBaseUrl}/api/resume/parse`, { method: "POST", body: formData });
      const data = await response.json() as ResumeData;
      if (!response.ok) throw new Error(data.detail || "Unable to parse this resume.");
      setRole(data.role || ""); setLocation(data.location || ""); setRemote(Boolean(data.open_to_remote)); setSeniority(data.seniority || ""); setKeywords(data.keywords || []);
      const parsedSources = (data.sources || []).filter((source): source is Source => sources.includes(source as Source));
      if (parsedSources.length) setSelectedSources(parsedSources);
      setResumeStatus("Resume parsed — search filters have been updated.");
    } catch (parseError) {
      setResumeError(parseError instanceof Error ? parseError.message : "Unable to parse this resume.");
    } finally { setIsParsingResume(false); }
  };
  const searchJobs = async () => {
    if (!role.trim()) { setError("Enter a role to search for."); return; }
    setIsLoading(true); setError(""); setSelectedId(null); setJobResults([]); setSearched(true);
    try {
      const portals = selectedSources.filter((source): source is Exclude<Source, "Company sites"> => source !== "Company sites").map((source) => portalDomains[source]);
      const response = await fetch(`${apiBaseUrl}/api/search`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role: role.trim(), location: remote ? "Remote" : location.trim(), seniority, keywords: keywords.join(" "), portals, force_refresh: false }) });
      const payload = await response.json() as SearchResponse;
      if (!response.ok) throw new Error(payload.error || payload.detail || "Unable to search for jobs.");
      setJobResults((payload.jobs || []).map((job) => normalizeJob(job, keywords)));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to reach the backend. Make sure it is running on port 8000.");
    } finally { setIsLoading(false); }
  };
  return <main className="min-h-screen"><nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur"><div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8"><div className="flex items-center gap-2.5"><div className="flex h-8 w-8 items-center justify-center rounded bg-brand text-sm font-bold text-white">L</div><span className="text-lg font-bold tracking-tight text-ink">Lattice<span className="text-brand">.</span></span></div><div className="flex h-full items-center gap-1 text-sm font-semibold"><button onClick={() => setActivePage("Jobs")} className={`h-full border-b-2 px-4 ${activePage === "Jobs" ? "border-brand text-brand" : "border-transparent text-muted hover:text-ink"}`}>Jobs</button><button onClick={() => setActivePage("Saved")} className={`h-full border-b-2 px-4 ${activePage === "Saved" ? "border-brand text-brand" : "border-transparent text-muted hover:text-ink"}`}>Saved <span className="ml-1 text-xs">({savedIds.length})</span></button></div></div></nav>
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8"><div className="mb-6"><p className="text-sm font-semibold text-brand">Good morning, find your next move</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">{activePage === "Jobs" ? "Find work that fits you." : "Your saved jobs."}</h1></div><SearchPanel {...{ role, setRole, location, setLocation, seniority, setSeniority, keywords, setKeywords, remote, setRemote, selectedSources, setSelectedSources, isLoading }} onSearch={searchJobs} />
      <ResumeUpload {...{ fileName: resumeName, isParsing: isParsingResume, status: resumeStatus, error: resumeError }} onFileChange={parseResume} />
      {error && <p role="alert" className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {isLoading && <p className="mt-4 text-sm text-muted">Searching live job listings…</p>}
      <div className="mt-7 lg:grid lg:grid-cols-[minmax(360px,460px)_minmax(0,1fr)] lg:gap-6"><section><div className="mb-3 flex items-center justify-between"><div><h2 className="font-semibold text-ink">{searched ? filteredJobs.length : filteredJobs.length} jobs found</h2><p className="mt-0.5 text-xs text-muted">Ranked for your preferences</p></div><select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-md border border-slate-300 bg-white px-2.5 py-2 text-xs font-medium text-slate-600 outline-none focus:border-brand"><option>Best match</option><option>Newest</option><option>Highest pay</option></select></div>
        <div className="mb-3 flex flex-wrap gap-1.5">{role && <span className="rounded-full bg-white px-2.5 py-1 text-xs text-muted">Role: {role}</span>}{location && <span className="rounded-full bg-white px-2.5 py-1 text-xs text-muted">Location: {location}</span>}{seniority && <span className="rounded-full bg-white px-2.5 py-1 text-xs text-muted">{seniority}</span>}{remote && <span className="rounded-full bg-white px-2.5 py-1 text-xs text-muted">Remote</span>}</div>
        <div className="scrollbar-thin space-y-2 lg:max-h-[calc(100vh-270px)] lg:overflow-y-auto lg:pr-1">{isLoading ? <LoadingResults /> : <>{filteredJobs.map((job) => <JobCard key={job.id} job={job} selected={selectedJob?.id === job.id} saved={savedIds.includes(job.id)} applied={appliedIds.includes(job.id)} onSelect={() => setSelectedId(job.id)} onSave={() => toggleSaved(job.id)} />)}{!filteredJobs.length && <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center"><div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-brand"><Icon name="search" /></div><h3 className="mt-3 font-semibold text-ink">No jobs found</h3><p className="mt-1 text-sm text-muted">Try widening your search or clearing a filter.</p><button onClick={() => { setLocation(""); setSeniority(""); setRemote(false); setSelectedSources(sources); }} className="mt-4 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-ink">Clear filters</button></div>}</>}</div></section>
        {selectedJob && <aside className="fixed inset-0 z-30 lg:static lg:top-24 lg:z-0 lg:block lg:h-[calc(100vh-160px)] lg:overflow-hidden lg:rounded-lg lg:border lg:border-slate-200 lg:shadow-card"><Detail job={selectedJob} saved={savedIds.includes(selectedJob.id)} applied={appliedIds.includes(selectedJob.id)} onSave={() => toggleSaved(selectedJob.id)} onApply={() => setAppliedIds((current) => current.includes(selectedJob.id) ? current : [...current, selectedJob.id])} onClose={() => setSelectedId(-1)} /></aside>}</div>
    </div>
  </main>;
}
