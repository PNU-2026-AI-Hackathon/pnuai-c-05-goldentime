'use server';

import type { N8NResponse, PatientTimelineSummary } from '@/types';

// Server-only env (NEXT_PUBLIC 제거 — URL이 클라이언트 번들에 노출되지 않음)
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

export async function callN8NWebhook(
  rawText: string,
  fileName: string,
  mockData: PatientTimelineSummary
): Promise<N8NResponse> {
  if (!N8N_WEBHOOK_URL) {
    return getMockResponse(mockData);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawText, fileName, hasTextLayer: true }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return { success: false, error: 'TIMEOUT', message: '처리 시간이 초과되었습니다.' };
    }
    return getMockResponse(mockData);
  }
}

async function getMockResponse(mockData: PatientTimelineSummary): Promise<N8NResponse> {
  await new Promise((r) => setTimeout(r, 1500));
  return { success: true, data: mockData };
}
