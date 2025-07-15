"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import {
  ArrowRight,
  Settings,
  Users,
  Gauge,
  BarChart,
  Brain,
  Handshake,
  ClipboardList,
  SearchCheck,
  CheckCircle,
  Rocket,
  Menu,
  User,
  CreditCard,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState, useRef } from "react"; // useRef import 추가
import Image from "next/image";

export default function Component() {
  const [selectedGuideSection, setSelectedGuideSection] =
    useState("account-management"); // State for guide section
  const navRef = useRef<HTMLElement>(null); // nav 요소에 대한 ref 생성

  const guideSections = [
    {
      id: "account-management",
      title: "계정 관리",
      description: "조직 구조에 맞춰 부서를 설정하고 조직원들을 초대하세요.",
      icon: <User className="size-8 text-blue-600" />,
      iconBg: "bg-blue-50",
    },
    {
      id: "naver-service-management",
      title: "네이버 서비스 관리",
      description:
        "마케터와 광고주를 등록하고, 광고주의 비즈머니 현황을 한눈에 확인하세요.",
      icon: <span className="text-green-500 text-3xl font-bold">N</span>,
      iconBg: "bg-green-50",
    },
    {
      id: "sm-pay-management",
      title: "SM Pay 관리",
      description: "광고주의 SMPay 신청부터 운영까지 모든 과정을 확인하세요.",
      icon: <CreditCard className="size-8 text-orange-500" />,
      iconBg: "bg-orange-50",
    },
    {
      id: "ad-performance-report",
      title: "광고 성과 리포트",
      description: "개인별, 조직별 광고 성과를 체계적으로 분석하고 관리하세요.",
      icon: <BarChart className="size-8 text-purple-600" />,
      iconBg: "bg-purple-50",
    },
    {
      id: "faq",
      title: "FAQ",
      description: "궁금하신 점이 있다면 먼저 FAQ를 확인해보세요.",
      icon: <HelpCircle className="size-8 text-red-500" />,
      iconBg: "bg-red-50",
    },
  ];

  // Smooth scrolling effect for navigation links
  useEffect(() => {
    const navElement = navRef.current;
    if (!navElement) return;

    const handleNavClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // 클릭된 요소가 Link 컴포넌트의 <a> 태그인지 확인하고 href가 #으로 시작하는지 확인
      if (
        target.tagName === "A" &&
        target.getAttribute("href")?.startsWith("#")
      ) {
        e.preventDefault(); // 기본 링크 동작 방지
        const targetId = target.getAttribute("href")?.substring(1); // # 제거
        document
          .getElementById(targetId || "")
          ?.scrollIntoView({ behavior: "smooth" }); // 해당 ID로 스크롤
      }
    };

    navElement.addEventListener("click", handleNavClick);

    return () => {
      navElement.removeEventListener("click", handleNavClick);
    };
  }, []); // 의존성 배열을 비워 컴포넌트 마운트 시 한 번만 실행

  return (
    <div className="flex flex-col min-h-dvh bg-gray-50 text-gray-900">
      {/* Top Header Row */}
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b bg-white shadow-sm">
        <Link
          href="/"
          className="flex items-center justify-center text-xl font-bold text-gray-900"
        >
          <Image
            src="/images/SMPay_logo.png"
            alt="SM PAY"
            width={100}
            height={44}
          />
        </Link>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="hidden sm:inline-flex text-gray-900 hover:bg-gray-100"
          >
            <Link href="#user-guide-section">SM Pay 이용 가이드</Link>
          </Button>
          <Button className="hidden sm:inline-flex bg-gray-900 text-white hover:bg-gray-800">
            <Link href="/landing/agency-login">대행사 접속 링크</Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="size-5" />
            <span className="sr-only">Toggle navigation</span>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section - Updated with background image and text colors */}
        {/* Second Header Row for Internal Navigation */}
        <nav
          ref={navRef}
          className="w-full bg-blue-800 py-3 px-4 md:px-6 flex justify-center items-center shadow-md"
        >
          <div className="container flex items-center justify-center gap-6 text-white text-sm font-medium">
            <Link
              href="#sm-pay-intro"
              className="hover:underline underline-offset-4 transition-colors"
            >
              SM Pay 소개
            </Link>
            <Link
              href="#features"
              className="hover:underline underline-offset-4 transition-colors"
            >
              주요 기능
            </Link>
            <Link
              href="#ai-automation"
              className="hover:underline underline-offset-4 transition-colors"
            >
              AI 자동화 시스템
            </Link>
            <Link
              href="#application-process"
              className="hover:underline underline-offset-4 transition-colors"
            >
              신청 절차
            </Link>
            <Link
              href="#user-guide-section"
              className="hover:underline underline-offset-4 transition-colors"
            >
              이용가이드
            </Link>
          </div>
        </nav>
        <section
          className="w-full py-12 md:py-24 lg:py-32 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/images/hero-background.png')` }}
        >
          <div className="w-full flex flex-col items-center justify-center px-4 md:px-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl leading-tight break-keep max-w-5xl mx-auto text-white">
              광고 효율은 높이고, 결제 부담은 낮춘
              <br />
              새로운 광고비 결제 방식
            </h1>
            <p className="mt-4 text-lg text-gray-200 md:text-xl max-w-3xl mx-auto">
              부담스러운 광고비, SM Pay가 미리 결제해드립니다. SM Pay는 광고비를
              선결제해주는 광고비 최적화 솔루션으로, 광고 효율 기반의 자동 상환
              시스템을 통해 <br />
              유연한 광고 운영을 지원합니다.
            </p>
          </div>
        </section>

        {/* What is SM Pay? Section - New Feel */}
        <section
          id="sm-pay-intro"
          className="w-full flex justify-center py-12 md:py-24 lg:py-32 bg-white"
        >
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              SM Pay란?
            </h2>
            <p className="mt-4 text-lg text-gray-600 md:text-xl max-w-3xl mx-auto">
              SM Pay는 광고비를 선결제하여 광고를 집행하고 후불로 자동 납부되는
              선결제형 서비스입니다. 대행사는 광고주에게 별도 결제 요청 없이도
              광고를 운영할 수 있으며, 목표 ROAS를 기반으로 광고 예산을 자동
              조정해, 안정적인 성과와 매출 향상을 동시에 이끌어냅니다.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <Card className="p-6 text-left rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                <CardTitle className="text-xl font-semibold">
                  광고비 결제 주기가 부담스러운 광고주
                </CardTitle>
                <CardDescription className="mt-2 text-gray-600">
                  성과 기반 자동 충전으로, 예산 걱정 없이 광고 운영
                </CardDescription>
              </Card>
              <Card className="p-6 text-left rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                <CardTitle className="text-xl font-semibold">
                  광고 관리와 필요한 마케터
                </CardTitle>
                <CardDescription className="mt-2 text-gray-600">
                  광고 성과 및 기존 심사 및 효율 기반 운영 가능
                </CardDescription>
              </Card>
              <Card className="p-6 text-left rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                <CardTitle className="text-xl font-semibold">
                  광고주 결제 지연으로 운영에 어려움이 있는 대행사
                </CardTitle>
                <CardDescription className="mt-2 text-gray-600">
                  선결제로 광고 지연 없이 바로 시작
                </CardDescription>
              </Card>
            </div>
          </div>
        </section>

        {/* Core Features Section - New Feel */}
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 flex justify-center"
        >
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              광고 운영, 처음부터 끝까지 SM PAY에서 한 번에 관리하세요
            </h2>
            <p className="mt-4 text-lg text-gray-600 md:text-xl max-w-3xl mx-auto">
              광고 운영의 모든 과정을 한 곳에서 통합 관리할 수 있도록{" "}
              <span className="font-semibold text-blue-600">
                자동화된 시스템
              </span>
              을 제공합니다. 이제 반복적인 광고 관리 업무는 SM PAY에 맡기고,
              중요한 광고 전략에 집중하세요. <br />
              팀장급 사용자라면 하위 마케터들의 광고 성과까지 한눈에 관리할 수
              있어
              <br />
              <span className="font-semibold text-blue-600">
                조직 단위의 효율적인 운영
              </span>
              이 가능합니다. <br />
              목표 이상의 성과를 달성하고 매출 성장을 실현할 수 있도록, <br />
              SM PAY가 든든한 파트너가 되어드리겠습니다.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-12">
              <div className="flex flex-col items-center space-y-3 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center size-20 rounded-xl bg-white shadow-sm">
                  <Settings className="size-10 text-gray-700" />
                </div>
                <p className="text-base font-medium">광고 관리</p>
              </div>
              <div className="flex flex-col items-center space-y-3 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center size-20 rounded-xl bg-white shadow-sm">
                  <Users className="size-10 text-gray-700" />
                </div>
                <p className="text-base font-medium">
                  조직 단위 심화 관리 지원
                </p>
              </div>
              <div className="flex flex-col items-center space-y-3 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center size-20 rounded-xl bg-white shadow-sm">
                  <Gauge className="size-10 text-gray-700" />
                </div>
                <p className="text-base font-medium">자동 입찰 관리</p>
              </div>
              <div className="flex flex-col items-center space-y-3 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center size-20 rounded-xl bg-white shadow-sm">
                  <BarChart className="size-10 text-gray-700" />
                </div>
                <p className="text-base font-medium">통합 광고 리포트</p>
              </div>
              <div className="flex flex-col items-center space-y-3 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center size-20 rounded-xl bg-white shadow-sm">
                  <Brain className="size-10 text-gray-700" />
                </div>
                <p className="text-base font-medium">광고 예산 AI 최적화</p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Automation Section - New Feel */}
        <section
          id="ai-automation"
          className="w-full py-12 md:py-24 lg:py-32 bg-white flex justify-center"
        >
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              스마트한 광고 운영, AI로 완성 <br /> AI 자동화 시스템
            </h2>
            <p className="mt-4 text-lg text-gray-600 md:text-xl max-w-3xl mx-auto">
              SM PAY는 AI 기술을 활용해 광고 예산, 키워드, 콘텐츠까지{" "}
              <span className="font-semibold text-blue-600">
                광고 운영 전반을 자동화
              </span>
              합니다. 광고 성과 데이터를 기반으로 예산을 자동 증감 조정하고,
              <br />
              실시간 트렌드에 따라 키워드와 소재를 자동 확장·생성함으로써
              <br />
              최소한의 운영 부담으로 최대의 성과를 낼 수 있는 환경을 제공합니다.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mt-12 text-left">
              <Card className="p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                <CardTitle className="text-xl font-semibold">
                  AI 기반 자동 광고비 최적화 모델
                </CardTitle>
                <CardDescription className="mt-2 text-gray-600">
                  SM PAY는 AI 예산 증감 모델을 통해 광고 성과를 예측하고, 광고
                  효율에 따라 광고비를 자동으로 증감 조정하는 시스템을
                  제공합니다.
                </CardDescription>
              </Card>
              <Card className="p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                <CardTitle className="text-xl font-semibold">
                  광고 키워드 & 소재 자동화 솔루션
                </CardTitle>
                <CardDescription className="mt-2 text-gray-600">
                  SM PAY는 대화형·생성형 AI 기술을 활용해 상품, 시즌, 트렌드,
                  이슈별 키워드를 자동 확장하고, <br />
                  이를 바탕으로 광고 소재와 콘텐츠를 자동 생성합니다.
                </CardDescription>
              </Card>
            </div>
          </div>
        </section>

        {/* Application Process Section - New Feel */}
        <section
          id="application-process"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 flex justify-center"
        >
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              SM PAY 신청 절차
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              광고 대금에 대한 걱정은 하지 마세요. SM Pay는 광고 성과 데이터를
              기반으로 선결제 여부를 판단해 리스크를 최소화한 구조로 운영됩니다.
              광고주 대신 선결제된 광고 대금의 회수 책임은 SM Pay가 집니다.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-12 mt-12">
              <div className="flex flex-col items-center space-y-2 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center size-16 rounded-xl bg-white shadow-sm">
                  <Handshake className="size-8 text-gray-700" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  대행사 담당자 협의
                </p>
              </div>
              <ArrowRight className="size-6 text-gray-400 hidden md:block" />
              <div className="flex flex-col items-center space-y-2 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center size-16 rounded-xl bg-white shadow-sm">
                  <ClipboardList className="size-8 text-gray-700" />
                </div>
                <p className="text-sm font-medium text-gray-700">SM PAY 신청</p>
              </div>
              <ArrowRight className="size-6 text-gray-400 hidden md:block" />
              <div className="flex flex-col items-center space-y-2 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center size-16 rounded-xl bg-white shadow-sm">
                  <SearchCheck className="size-8 text-gray-700" />
                </div>
                <p className="text-sm font-medium text-gray-700">광고주 심사</p>
              </div>
              <ArrowRight className="size-6 text-gray-400 hidden md:block" />
              <div className="flex flex-col items-center space-y-2 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center size-16 rounded-xl bg-white shadow-sm">
                  <CheckCircle className="size-8 text-gray-700" />
                </div>
                <p className="text-sm font-medium text-gray-700">최종 검토</p>
              </div>
              <ArrowRight className="size-6 text-gray-400 hidden md:block" />
              <div className="flex flex-col items-center space-y-2 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center size-16 rounded-xl bg-white shadow-sm">
                  <Rocket className="size-8 text-gray-700" />
                </div>
                <p className="text-sm font-medium text-gray-700">서비스 개시</p>
              </div>
            </div>
          </div>
        </section>

        {/* User Guide Section - Integrated Content */}
        <section
          id="user-guide-section"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-800 text-white flex justify-center"
        >
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              SM PAY 이용가이드
            </h2>
            <p className="mt-4 text-lg text-gray-300 md:text-xl max-w-3xl mx-auto mb-12">
              SM Pay 이용에 필요한 주요 절차와 기능을 안내합니다. 서비스
              신청부터 운영까지, 단계별 사용법을 지금 바로 확인해보세요.
            </p>

            {/* Section Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
              {guideSections.map((section) => (
                <Card
                  key={section.id}
                  onClick={() => setSelectedGuideSection(section.id)}
                  className={`p-6 flex flex-col items-center text-center cursor-pointer rounded-xl shadow-sm transition-all duration-200
                  ${selectedGuideSection === section.id ? "border-2 border-blue-500 bg-blue-50 text-gray-900 shadow-md" : "bg-white text-gray-900 hover:shadow-md"}`}
                >
                  <div
                    className={`flex items-center justify-center size-16 rounded-full mb-4 ${section.iconBg}`}
                  >
                    {section.icon}
                  </div>
                  <CardTitle className="text-lg font-semibold mb-1">
                    {section.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600 line-clamp-2">
                    {section.description}
                  </CardDescription>
                </Card>
              ))}
            </div>

            {/* Content Display Area */}
            <div className="p-8 bg-white rounded-xl shadow-sm text-gray-900 text-left">
              {selectedGuideSection === "account-management" && (
                <section>
                  <h2 className="text-2xl font-bold mb-6">계정 관리</h2>
                  <p className="text-gray-600 mb-8">
                    조직 구조에 맞춰 부서를 설정하고 조직원들을 초대하세요.
                  </p>

                  <div className="grid gap-8">
                    {/* Step 1 */}
                    <Card className="p-6 rounded-xl shadow-sm bg-gray-50">
                      <CardTitle className="flex items-center gap-2 text-lg font-semibold mb-4">
                        <span className="flex items-center justify-center size-8 rounded-full bg-gray-900 text-white text-sm font-bold">
                          1
                        </span>
                        대행사 등록
                      </CardTitle>
                      <CardDescription className="text-gray-700">
                        SM Pay 대행사를 생성한 후, 대행사의 최상위 그룹장(대표)
                        계정을 메일로 전달합니다.
                      </CardDescription>
                    </Card>

                    {/* Step 2 */}
                    <Card className="p-6 rounded-xl shadow-sm bg-gray-50">
                      <CardTitle className="flex items-center gap-2 text-lg font-semibold mb-4">
                        <span className="flex items-center justify-center size-8 rounded-full bg-gray-900 text-white text-sm font-bold">
                          2
                        </span>
                        최상위 그룹장 계정 생성
                      </CardTitle>
                      <CardDescription className="text-gray-700">
                        전달된 메일을 통해 비밀번호를 재설정한 후, 안내된
                        가이드를 통해 대행사 계정을 등록할 수 있습니다.
                      </CardDescription>
                    </Card>

                    {/* Step 3 */}
                    <Card className="p-6 rounded-xl shadow-sm bg-gray-50">
                      <CardTitle className="flex items-center gap-2 text-lg font-semibold mb-4">
                        <span className="flex items-center justify-center size-8 rounded-full bg-gray-900 text-white text-sm font-bold">
                          3
                        </span>
                        대행사 부서 생성
                      </CardTitle>
                      <CardDescription className="text-gray-700">
                        대행사의 최상위 그룹장은 대행사 내 부서별 최상위 부서를
                        생성해야 합니다.
                        <br />
                        <span className="font-semibold">
                          ※ 부서는 최대 3단계까지 생성할 수 있습니다.
                        </span>
                        <br />
                        SM Pay는 부서 체계를 기반으로 그룹원, 광고주 데이터를
                        관리하므로, 그룹원 초대 전에 부서 관리를 먼저
                        진행해주세요.
                        <br />
                        부서 생성은{" "}
                        <span className="font-semibold">
                          관리 &gt; 부서 관리
                        </span>{" "}
                        메뉴에서 가능합니다.
                      </CardDescription>
                    </Card>

                    {/* Step 4 */}
                    <Card className="p-6 rounded-xl shadow-sm bg-gray-50">
                      <CardTitle className="flex items-center gap-2 text-lg font-semibold mb-4">
                        <span className="flex items-center justify-center size-8 rounded-full bg-gray-900 text-white text-sm font-bold">
                          4
                        </span>
                        그룹/그룹원 계정 생성
                      </CardTitle>
                      <CardDescription className="text-gray-700">
                        대행사의 최상위 그룹장은 그룹 및 그룹원의 계정을 생성할
                        수 있습니다.
                        <br />
                        최상위 그룹장 본인 외에 속한 그룹의 계정을 생성할 수
                        있습니다.
                      </CardDescription>
                    </Card>

                    {/* Step 5 */}
                    <Card className="p-6 rounded-xl shadow-sm bg-gray-50">
                      <CardTitle className="flex items-center gap-2 text-lg font-semibold mb-4">
                        <span className="flex items-center justify-center size-8 rounded-full bg-gray-900 text-white text-sm font-bold">
                          5
                        </span>
                        회원 초대 이메일
                      </CardTitle>
                      <CardDescription className="text-gray-700">
                        회원 초대 이메일에는 SM Pay 접속을 위한 전용 링크가
                        포함되어 있습니다.
                        <br />
                        <span className="font-semibold text-red-600">
                          해당 링크는 최대 3일까지만 유효합니다.
                        </span>
                      </CardDescription>
                    </Card>
                  </div>
                </section>
              )}

              {selectedGuideSection === "naver-service-management" && (
                <section>
                  <h2 className="text-2xl font-bold mb-6">
                    네이버 서비스 관리
                  </h2>
                  <p className="text-gray-600 mb-8">
                    SM Pay 서비스를 이용하기 위해서는 마케터 API 라이선스와
                    광고주 등록이 먼저 필요합니다.
                    <br />
                    이후에 충전, 결제, 예산 관리 등 SM Pay의 모든 기능을
                    사용하실 수 있습니다.
                  </p>

                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Step 1 */}
                    <Card className="p-6 rounded-xl shadow-sm bg-gray-50">
                      <CardTitle className="flex items-center gap-2 text-lg font-semibold mb-4">
                        <span className="flex items-center justify-center size-8 rounded-full bg-gray-900 text-white text-sm font-bold">
                          1
                        </span>
                        마케터 API 라이선스 등록
                      </CardTitle>
                      <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
                        <li>
                          먼저 네이버 서비스 설정 &gt; API 라이선스 등록
                          (선택)에 마케터 API 키 등록 페이지 링크 넣어주기
                          메뉴에서 네이버 마케터 라이선스를 등록해주세요.
                        </li>
                        <li>
                          API 라이선스 동기화에는 최대 30분이 소요될 수
                          있습니다.
                        </li>
                        <li>
                          [API 라이선스는 네이버 광고 &gt; 도구 &gt; API 사용
                          권한 페이지에서 확인 가능합니다.]
                        </li>
                      </ul>
                    </Card>

                    {/* Step 2 */}
                    <Card className="p-6 rounded-xl shadow-sm bg-gray-50">
                      <CardTitle className="flex items-center gap-2 text-lg font-semibold mb-4">
                        <span className="flex items-center justify-center size-8 rounded-full bg-gray-900 text-white text-sm font-bold">
                          2
                        </span>
                        광고주 등록
                      </CardTitle>
                      <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
                        <li>
                          API 라이선스 등록이 완료되었다면, 네이버 서비스 설정
                          &gt; 광고주 등록 (선택) 메뉴에서 SM Pay 서비스를
                          이용하실 광고주를 등록해주세요.
                        </li>
                        <li>
                          광고주 등록 후 최대 1시간 이내에 광고 데이터 동기화가
                          완료됩니다.
                        </li>
                      </ul>
                    </Card>

                    {/* Step 3 */}
                    <Card className="p-6 rounded-xl shadow-sm bg-gray-50">
                      <CardTitle className="flex items-center gap-2 text-lg font-semibold mb-4">
                        <span className="flex items-center justify-center size-8 rounded-full bg-gray-900 text-white text-sm font-bold">
                          3
                        </span>
                        광고주별 비즈머니 조회
                      </CardTitle>
                      <p className="text-sm text-gray-700">
                        광고주 등록까지 완료되면 SM Pay 서비스를 이용하실 수
                        있습니다.
                      </p>
                      <p className="text-sm text-gray-700 mt-2">
                        등록된 광고주의 비즈머니는 광고주별 비즈머니 조회
                        메뉴에서 손쉽게 확인할 수 있으며, 이를 통해 충전 여부 및
                        충전 필요 여부를 판단하실 수 있습니다.
                      </p>
                    </Card>
                  </div>
                </section>
              )}

              {selectedGuideSection === "sm-pay-management" && (
                <section>
                  <h2 className="text-2xl font-bold mb-6">SM Pay 관리</h2>
                  <p className="text-gray-600 mb-8">
                    SM Pay는 광고비를 선결제하여 광고를 집행하고 후불로 자동
                    납부되는 서비스입니다.
                    <br />
                    SM Pay 서비스 신청 시 선결제 기준 ROAS와 충전 금액을 직접
                    설정할 수 있습니다.
                  </p>

                  {/* ROAS Flow Diagram */}
                  <div className="flex flex-col items-center justify-center gap-4 mb-12">
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full justify-center">
                      <Card className="p-4 rounded-xl shadow-sm bg-gray-50 text-center flex-1 min-w-[200px]">
                        <CardTitle className="text-lg font-semibold">
                          기존 ROAS 설정
                        </CardTitle>
                      </Card>
                      <ChevronRight className="size-6 text-gray-400 hidden md:block" />
                      <div className="flex flex-col items-center flex-1 min-w-[200px]">
                        <Card className="p-4 rounded-xl shadow-sm bg-gray-50 text-center w-full">
                          <CardTitle className="text-lg font-semibold">
                            기존 ROAS에 도달하면 자동으로 광고비 증액
                          </CardTitle>
                        </Card>
                        <div className="my-2 text-gray-500">또는</div>
                        <Card className="p-4 rounded-xl shadow-sm bg-gray-50 text-center w-full">
                          <CardTitle className="text-lg font-semibold">
                            기존 ROAS의 미달이면 자동으로 광고비 감액
                          </CardTitle>
                        </Card>
                      </div>
                      <ChevronRight className="size-6 text-gray-400 hidden md:block" />
                      <Card className="p-4 rounded-xl shadow-sm bg-gray-50 text-center flex-1 min-w-[200px]">
                        <CardTitle className="text-lg font-semibold">
                          광고 성과에 따라 광고비를 조정하여 효율적인 예산 운영
                        </CardTitle>
                      </Card>
                    </div>
                    <p className="text-sm text-red-600 font-semibold mt-4">
                      광고비 선충전은 1일 1회 이루어지며, 신청 후 익일부터
                      선결제가 진행됩니다.
                      <br />
                      단, 광고주 매출액의 잔액 부족으로 3회 이상 실패 시
                      선결제는 일시정지됩니다.
                    </p>
                  </div>

                  {/* 6-Step Process */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Step 1 */}
                    <Card className="p-6 rounded-xl shadow-sm bg-gray-50">
                      <CardTitle className="flex items-center gap-2 text-lg font-semibold mb-4">
                        <span className="flex items-center justify-center size-8 rounded-full bg-gray-900 text-white text-sm font-bold">
                          1
                        </span>
                        서비스 신청
                      </CardTitle>
                      <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
                        <li>
                          광고주와 협의한 대행사 담당자에게 SM Pay 서비스 신청
                          요청
                        </li>
                        <li>선결제 금액 확정</li>
                        <li>충전 규정 동의</li>
                        <li>
                          신청이 완료되면 대행사 담당자에게 접수 알림이
                          발송됩니다.
                        </li>
                      </ul>
                    </Card>

                    {/* Step 2 */}
                    <Card className="p-6 rounded-xl shadow-sm bg-gray-50">
                      <CardTitle className="flex items-center gap-2 text-lg font-semibold mb-4">
                        <span className="flex items-center justify-center size-8 rounded-full bg-gray-900 text-white text-sm font-bold">
                          2
                        </span>
                        광고주 심사
                      </CardTitle>
                      <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
                        <li>
                          최상위 그룹장이 광고주의 적합 여부를 심사합니다.
                        </li>
                        <li>
                          심사가 완료되면, SM Pay 담당자가 심사 안내 메일 발송
                          및 심사 결과에 대한 설명 요청 메일이 발송됩니다.
                        </li>
                      </ul>
                    </Card>

                    {/* Step 3 */}
                    <Card className="p-6 rounded-xl shadow-sm bg-gray-50">
                      <CardTitle className="flex items-center gap-2 text-lg font-semibold mb-4">
                        <span className="flex items-center justify-center size-8 rounded-full bg-gray-900 text-white text-sm font-bold">
                          3
                        </span>
                        운영 검토
                      </CardTitle>
                      <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
                        <li>SM Pay가 운영 여부를 최종 검토합니다.</li>
                        <li>
                          대행사 담당자, 최상위 그룹장에게 검토 결과 안내 메일이
                          발송됩니다.
                        </li>
                      </ul>
                    </Card>

                    {/* Step 4 */}
                    <Card className="p-6 rounded-xl shadow-sm bg-gray-50">
                      <CardTitle className="flex items-center gap-2 text-lg font-semibold mb-4">
                        <span className="flex items-center justify-center size-8 rounded-full bg-gray-900 text-white text-sm font-bold">
                          4
                        </span>
                        광고주 동의 요청
                      </CardTitle>
                      <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
                        <li>
                          검토가 완료되면 대행사 담당자는 광고주에게 SM Pay
                          서비스 이용 동의를 요청합니다.
                        </li>
                        <li>
                          광고주 동의가 완료되면 대행사 담당자는 SM Pay에 등록
                          요청을 합니다.
                        </li>
                      </ul>
                    </Card>

                    {/* Step 5 */}
                    <Card className="p-6 rounded-xl shadow-sm bg-gray-50">
                      <CardTitle className="flex items-center gap-2 text-lg font-semibold mb-4">
                        <span className="flex items-center justify-center size-8 rounded-full bg-gray-900 text-white text-sm font-bold">
                          5
                        </span>
                        광고주 동의
                      </CardTitle>
                      <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2">
                        <li>
                          SM Pay에 광고주 정보가 등록되면 수신인 정보, 충전
                          금액, 결제 기준 등 최종 동의 절차를 진행합니다.
                        </li>
                        <li>개인정보 수집·활용 동의</li>
                        <li>서비스 이용 동의</li>
                        <li>ARS 본인 인증</li>
                        <li>광고주 동의가 완료되면, 비즈머니가 발급됩니다.</li>
                      </ul>
                    </Card>

                    {/* Step 6 */}
                    <Card className="p-6 rounded-xl shadow-sm bg-gray-50">
                      <CardTitle className="flex items-center gap-2 text-lg font-semibold mb-4">
                        <span className="flex items-center justify-center size-8 rounded-full bg-gray-900 text-white text-sm font-bold">
                          6
                        </span>
                        운영 시작
                      </CardTitle>
                      <p className="text-sm text-gray-700">
                        모든 절차가 완료되면{" "}
                        <span className="font-semibold">
                          SM Pay 서비스가 개시됩니다.
                        </span>
                      </p>
                    </Card>
                  </div>
                </section>
              )}

              {selectedGuideSection === "ad-performance-report" && (
                <section>
                  <h2 className="text-2xl font-bold mb-6">광고 성과 리포트</h2>
                  <p className="text-gray-600 mb-8">
                    매체별, 상품별, 키워드별 광고 성과 분석 보고서를 제공합니다.
                    <br />
                    통합 보고서를 통해 SM Pay에서 손쉽게 광고를 관리하실 수
                    있습니다.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-4">
                      <h3 className="text-lg font-semibold text-center">
                        기존
                      </h3>
                      <Card className="p-4 rounded-xl shadow-sm bg-gray-50 text-center">
                        <CardDescription className="text-gray-700">
                          광고주 또는 계정별로만 확인 가능
                          <br />
                          본인이 직접 운영하는 계정만 확인 가능
                        </CardDescription>
                      </Card>
                      <Card className="p-4 rounded-xl shadow-sm bg-gray-50 text-center">
                        <CardDescription className="text-gray-700">
                          기본적으로 AE 1인 연동만 가능
                        </CardDescription>
                      </Card>
                      <Card className="p-4 rounded-xl shadow-sm bg-gray-50 text-center">
                        <CardDescription className="text-gray-700">
                          개별 성과 트래킹 중심,
                          <br />
                          조직 차원의 리딩 활용은 제한적
                        </CardDescription>
                      </Card>
                    </div>
                    <div className="flex flex-col gap-4">
                      <h3 className="text-lg font-semibold text-center">
                        SM Pay
                      </h3>
                      <Card className="p-4 rounded-xl shadow-sm bg-gray-50 text-center">
                        <CardDescription className="text-gray-700">
                          그룹장이 소속 AE 전체의 광고 계정 성과 지표를 한눈에
                          확인 가능
                        </CardDescription>
                      </Card>
                      <Card className="p-4 rounded-xl shadow-sm bg-gray-50 text-center">
                        <CardDescription className="text-gray-700">
                          AE 1인에게 연동된 광고 계정은 물론, 조직 단위 통합
                          관리 가능
                        </CardDescription>
                      </Card>
                      <Card className="p-4 rounded-xl shadow-sm bg-gray-50 text-center">
                        <CardDescription className="text-gray-700">
                          조직장 입장에서 팀 리딩/성과/인센티브 설계에 최적화된
                          구조
                        </CardDescription>
                      </Card>
                    </div>
                  </div>
                  <p className="text-sm text-blue-600 font-semibold mt-8 text-center">
                    광고 성과를 조직 단위로 실시간 관리하는 단 하나의 통합
                    솔루션
                  </p>
                  <p className="text-sm text-gray-700 mt-2 text-center">
                    실시간 광고비 충전 및 잔여 광고비 모니터링을 통해 보다
                    전략적이고 체계적인 예산 운영이 가능합니다
                  </p>
                </section>
              )}

              {selectedGuideSection === "faq" && (
                <section>
                  <h2 className="text-2xl font-bold mb-6">FAQ</h2>
                  <p className="text-gray-600 mb-8">
                    궁금하신 점이 있다면 먼저 FAQ를 확인해보세요.
                  </p>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                        Q. SM Pay를 이용할 경우, 세금계산서 발행 방식이나 위임
                        절차에 변경이 있나요?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700 text-sm">
                        A. SM Pay 선충전과 후불회수에 대해 세금계산서 발행의
                        주체 등 변경되는 사항은 전혀 없습니다. 기존의 방식을
                        유지하시면 됩니다.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                        Q. 광고비 자동 회수를 위해 광고주 동의가 필요한가요?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700 text-sm">
                        A. 광고비의 자동회수를 위해서는 광고주 명의의 계좌에
                        대해 CMS 출금이 가능하도록 동의가 필요합니다. 대행사의
                        최상위 관리자가 심사를 완료하고 SM Pay가 운영 검토를
                        마치면, 담당자가 광고주에게 출금 동의 요청을 전송하며,
                        광고주는 해당 동의를 모바일에서 비대면으로 처리할 수
                        있습니다.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                        Q. 광고비는 언제 자동으로 충전되나요?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700 text-sm">
                        A. 매일 새벽, 전일까지의 광고성과를 분석하여 AM 04:00에
                        자동으로 광고비를 입금처리합니다.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                      <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                        Q. SM Pay는 어떤 광고 매체에서 사용할 수 있나요?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700 text-sm">
                        A. 현재는 네이버 광고 플랫폼(SA)에 대해서만 지원되지만,
                        금년 내 메타, 구글 등으로 확대할 예정입니다.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                      <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                        Q. SM Pay 운영 시 광고주의 정보는 어떻게 활용되나요?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700 text-sm">
                        A. 광고주의 정보는 SM Pay 시스템 내 광고비 증감 추정을
                        위한 용도로만 활용됩니다. 그 외의 용도로는 사용되지
                        않으며, 대행사의 광고성과를 임의로 검토하거나 조회하지
                        않습니다.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-6">
                      <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                        Q. 광고주의 개인정보가 마케팅 등 다른 목적으로
                        사용되지는 않나요?
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700 text-sm">
                        A. SM Pay는 운영을 위한 최소한의 정보만 수집하며,
                        광고주의 개인정보를 마케팅이나 기타 목적으로 사용하지
                        않습니다.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </section>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Consistent with Landing Page */}
      <footer className="flex flex-col sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white text-gray-600 text-xs">
        <p className="text-center sm:text-left">
          &copy; {new Date().getFullYear()} SM Pay. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6 mt-2 sm:mt-0">
          <Link href="#" className="hover:underline underline-offset-4">
            이용약관
          </Link>
          <Link href="#" className="hover:underline underline-offset-4">
            개인정보처리방침
          </Link>
          <Link href="#" className="hover:underline underline-offset-4">
            고객문의
          </Link>
        </nav>
      </footer>
    </div>
  );
}
