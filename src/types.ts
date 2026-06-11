/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ScreenId = "INTRO_AR" | "ADVANCED_AR";

export type TransitionType = "push" | "push_back" | "slide_up" | "none";

export interface HotspotData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  top: number; // percentage
  left: number; // percentage
}

export interface SettingsState {
  gyroscope: boolean;
  sound: boolean;
  autoRotate: boolean;
  highQuality: boolean;
}

export const HOTSPOTS_INTRO: HotspotData[] = [
  {
    id: "soil",
    title: "화산송이 토양",
    subtitle: "제주 화산 지형의 선물",
    description: "제주의 다공질 화산 토양은 순수한 녹차 성장에 필수적인 천연 배수와 풍부한 미네랄을 제공하여 오설록 고유의 풍미를 자아냅니다.",
    tags: ["자연 배수", "화산 토양", "미네랄 풍부"],
    top: 60,
    left: 15,
  },
  {
    id: "mountain",
    title: "산방산",
    subtitle: "서광 차밭의 천연 병풍",
    description: "강한 바닷바람으로부터 어린 찻잎을 안전하게 보호하며 섭씨 최적의 미세기후를 선사하는 웅장하고 아름다운 배경입니다.",
    tags: ["비바람 방패", "미세 기후", "자연 치유"],
    top: 45,
    left: 35,
  },
  {
    id: "museum",
    title: "티 뮤지엄",
    subtitle: "한국 차 문화의 중심지",
    description: "전통 리추얼 다도와 현대 미니멀리즘 건축이 조화를 이루는 품격 있는 오설록의 대표적 복합 문화 공간입니다.",
    tags: ["다도 체험", "전통과 현대", "대표 관광지"],
    top: 52,
    left: 45,
  },
];

export const HOTSPOTS_ADVANCED: HotspotData[] = [
  {
    id: "soil",
    title: "화산송이 토양",
    subtitle: "제주 화산 지형의 선물",
    description: "제주의 다공질 화산 토양은 순수한 녹차 성장에 필수적인 천연 배수와 미네랄을 제공합니다. 이는 오설록 녹차만의 깊은 맛을 완성합니다.",
    tags: ["유기농 인증", "화산 토양", "미네랄"],
    top: 65,
    left: 30,
  },
  {
    id: "mountain",
    title: "산방산",
    subtitle: "서광 차밭의 수호신",
    description: "웅장한 산방산은 강한 바닷바람으로부터 차밭을 보호하며 완벽한 미세 기후를 조성합니다. 제주의 자연이 빚어낸 거대한 병풍과 같습니다.",
    tags: ["자연 병풍", "미세 기후", "경관"],
    top: 50,
    left: 50,
  },
  {
    id: "museum",
    title: "티 뮤지엄",
    subtitle: "전통과 현대의 공존",
    description: "전통적인 한국 차 문화와 현대적인 건축미가 만나는 공간입니다. 제주 차의 역사를 체험하고 신선한 차를 시음할 수 있는 문화 복합 공간입니다.",
    tags: ["건축미", "차 시음", "문화 공간"],
    top: 55,
    left: 70,
  },
];
