"use client";

import { BeforeAfterSlider } from "./BeforeAfterSlider";

const S3_BASE = "https://genea-photos.s3.sa-east-1.amazonaws.com/landing";

const results = [
  {
    tag: "Foto de família",
    story: "João achou essa foto no fundo de uma gaveta. Tava toda amarelada e com manchas. Olha como ficou.",
    beforeImage: `${S3_BASE}/result-01-old.png`,
    afterImage: `${S3_BASE}/result-01-new.png`,
  },
  {
    tag: "Foto de infância",
    story: "Dona Maria guardou essa foto por 40 anos. Era a única do filho pequeno. Tava toda manchada de mofo. Recuperamos tudo.",
    beforeImage: `${S3_BASE}/result-02-old.png`,
    afterImage: `${S3_BASE}/result-02-new.png`,
  },
  {
    tag: "Foto de casamento",
    story: "Essa foto pegou chuva numa enchente. A família achou que tinha perdido pra sempre. Conseguimos trazer de volta.",
    beforeImage: `${S3_BASE}/result-03-old.png`,
    afterImage: `${S3_BASE}/result-03-new.png`,
  },
];

export function ResultsSection() {
  return (
    <section id="resultados" className="py-16 md:py-24 px-4 md:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-ih-text mb-4">
            Veja o que a gente já fez
          </h2>
          <p className="text-lg text-ih-text-secondary">
            Histórias reais de fotos que voltaram à vida.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {results.map((result) => (
            <div
              key={result.tag}
              className="bg-ih-surface rounded-2xl shadow-card overflow-hidden"
            >
              {/* Slider */}
              <div className="p-4 pb-0">
                <BeforeAfterSlider
                  beforeImage={result.beforeImage}
                  afterImage={result.afterImage}
                  className="rounded-xl overflow-hidden"
                />
              </div>

              {/* Content */}
              <div className="p-4 pt-3 space-y-3">
                {/* Tag */}
                <span className="inline-block rounded-full bg-genea-green/10 px-3 py-1 text-xs font-medium text-genea-green">
                  {result.tag}
                </span>

                {/* Story */}
                <p className="text-sm text-ih-text-secondary leading-relaxed">
                  {result.story}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
