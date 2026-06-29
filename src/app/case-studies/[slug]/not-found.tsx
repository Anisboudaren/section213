import Link from "next/link";

export default function CaseStudyNotFound() {
  return (
    <div className="theme-marketing flex min-h-svh flex-col items-center justify-center bg-ink px-4 text-center text-white">
      <h1 className="font-display text-3xl">Étude de cas introuvable</h1>
      <p className="mt-3 max-w-md text-white/60">
        Ce projet a peut-être été retiré ou n&apos;est plus publié.
      </p>
      <Link
        href="/case-studies"
        className="mt-8 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold hover:border-ruby"
      >
        Retour au portfolio
      </Link>
    </div>
  );
}
