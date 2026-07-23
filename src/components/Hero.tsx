'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function Hero() {
  const ref = useScrollAnimation();

  return (
    <>
      <section className="relative overflow-hidden bg-[#EAF1FF] px-4 pt-8 pb-24">
        <div
          ref={ref}
          className="relative mx-auto flex min-h-[635px] max-w-[1520px] items-center justify-center overflow-hidden rounded-[44px] bg-[#0B63FF] px-5 pb-40 md:px-8"
        >
          {/* 카드(hero_card) 포함 전체가 박스 라운드에서 클리핑 — 박스 밖 돌출 없음(2026-07-18 롤백) */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[44px]">
            {/* Background video (Paper EMR seamless loop) */}
            {/* object-bottom: 피사체(차트·패널) 하단 기준 정렬 — 어떤 비율에서도 영상 아래가 잘리지 않음 */}
            <video
              className="absolute inset-0 h-full w-full object-cover object-bottom"
              autoPlay
              loop
              muted
              playsInline
              aria-hidden="true"
            >
              <source src="/hero-emr.mp4" type="video/mp4" />
            </video>
            {/* Legibility + brand tint over the video */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(7,16,24,0.34) 0%, rgba(11,74,255,0.30) 46%, rgba(7,16,24,0.64) 100%)',
              }}
            />

            <div
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, rgba(255,255,255,0.22) 1px, transparent 1px)',
                backgroundSize: '138px 100%',
              }}
            />

            <div
              className="absolute left-1/2 top-[10%] h-[720px] w-[720px] -translate-x-1/2 rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 36%, transparent 70%)',
                filter: 'blur(60px)',
              }}
            />
          </div>

          <div className="relative z-10 flex w-full flex-col items-center text-center">
            <span className="mb-6 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-white/75">
              <span className="h-1 w-1 rounded-full bg-white" />
              Next-Gen Longitudinal EMR AI
            </span>

            <h1 className="font-display mb-7 text-[3.4rem] font-extrabold leading-[0.95] tracking-[-0.045em] text-[#FFF5EF] sm:text-[4.5rem] lg:text-[5.25rem]">
              차트원샷
            </h1>

            <p className="mb-12 text-lg font-light leading-tight text-white/90 sm:text-xl lg:text-2xl">
              길고 복잡한 EMR도 초 단위로 읽습니다
            </p>

            <div className="mb-16 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/submit"
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
              </Link>

              <Link
                href="/product"
                className="inline-flex h-12 items-center rounded-full bg-[#17191F] px-6 text-[14px] font-medium text-white shadow-[0_14px_30px_rgba(0,0,0,0.18)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                작동 원리 보기
              </Link>
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

      <section className="relative overflow-hidden bg-[#EAF1FF] px-4 pb-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(24,74,255,0.10) 1px, transparent 1px)',
            backgroundSize: '190px 100%',
          }}
        />

        <div className="relative z-8 mx-auto max-w-xl text-center">
          <h3 className="text-[28px] font-medium leading-[1.5] tracking-[-0.05em] text-[#1A1A1A]">
            <span className="text-[#1F5BFF] font-semibold">차트원샷</span>은 길고 복잡한 차트를 <br/>
            내 분과에서 필요한, <span className="text-[#1F5BFF] font-semibold">내가 궁금한</span> <br/>
            내용만 빠르게 쏙쏙
          </h3>
        </div>
      </section>
    </>
  );
}