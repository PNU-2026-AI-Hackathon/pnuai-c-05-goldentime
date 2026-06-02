'use client';

import Image from 'next/image';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function Hero() {
  const ref = useScrollAnimation();

  return (
    <>
      <section className="relative overflow-hidden bg-[#071018] px-4 pt-36 pb-24">
        <div
          ref={ref}
          className="relative mx-auto flex min-h-[635px] max-w-[1520px] items-center justify-center overflow-hidden rounded-[44px] bg-[#0B63FF] px-5 pb-40 md:px-8"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                'linear-gradient(90deg, rgba(255,255,255,0.22) 1px, transparent 1px)',
              backgroundSize: '138px 100%',
            }}
          />

          <div
            className="pointer-events-none absolute left-1/2 top-[10%] h-[720px] w-[720px] -translate-x-1/2 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 36%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />

          <div className="relative z-10 flex w-full flex-col items-center text-center">
            <span className="mb-6 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-white/75">
              <span className="h-1 w-1 rounded-full bg-white" />
              Next-Gen Longitudinal EMR AI
            </span>

            <h1 className="font-display mb-7 text-[3.4rem] font-extrabold leading-[0.95] tracking-[-0.045em] text-[#FFF5EF] sm:text-[4.5rem] lg:text-[5.25rem]">
              차트원샷
            </h1>

            <p className="mb-4 text-lg font-medium leading-tight text-white/90 sm:text-xl lg:text-2xl">
              길고 복잡한 EMR도 5초 안에 읽습니다
            </p>
            <p className="mb-12 max-w-md text-[14px] font-light leading-relaxed tracking-[-0.01em] text-white/60 sm:text-[15px] lg:text-base">
              PK 의대생과 전공의에게 차트를 읽는 가이드라인을 제공합니다!
            </p>

            <div className="mb-16 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#demo"
                className="group inline-flex h-12 items-center gap-3 rounded-full bg-[#FFF5EF] px-6 text-[14px] font-semibold text-[#10131A] shadow-[0_14px_30px_rgba(0,0,0,0.18)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                지금 체험하기
                <span className="relative flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-[#1F5BFF] text-white">
                  <ArrowRight
                    size={13}
                    strokeWidth={2.4}
                    className="absolute transition-all duration-300 group-hover:translate-y-5 group-hover:opacity-0"
                  />
                  <ArrowDown
                    size={13}
                    strokeWidth={2.4}
                    className="absolute -translate-y-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                  />
                </span>
              </a>

              <a
                href="#how-it-works"
                className="inline-flex h-12 items-center rounded-full bg-[#17191F] px-6 text-[14px] font-medium text-white shadow-[0_14px_30px_rgba(0,0,0,0.18)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                작동 원리 보기
              </a>
            </div>
          </div>

          <div className="absolute bottom-[-118px] left-1/2 z-20 w-[70%] max-w-[600px] -translate-x-1/2">
            <Image
              src="/hero_card.png"
              alt="Chart One Shot Card"
              width={760}
              height={520}
              priority
              className="h-auto w-full object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.28)]"
            />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#071018] px-4 pb-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(31,91,255,0.15) 1px, transparent 1px)',
            backgroundSize: '190px 100%',
          }}
        />

        <div className="relative z-10 mx-auto max-w-xl text-center">
          <h3 className="text-[28px] font-medium leading-[1.5] tracking-[-0.05em] text-[#FFF5EF]">
            의사가 복잡한 케이스를 검토하는 데 걸리는 시간 25분. <br />
            <span className="text-[#1F5BFF] font-semibold">차트원샷</span>은 이를{' '}
            <span className="text-[#1F5BFF] font-semibold">5초</span>로 단축하여 <br /> 골든타임을 지킵니다.
          </h3>

          <p className="mt-10 text-[12px] font-light tracking-[-0.03em] text-white/55">
            근거: Nolan et al., Mayo Clinic 다기관 설문연구, Applied Clinical
            Informatics (2017)
          </p>
        </div>
      </section>
    </>
  );
}