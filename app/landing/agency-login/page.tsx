"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Building2, Plus, Clock, ExternalLink } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function AgencyLoginPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // 대행사 데이터 (실제로는 API에서 가져올 데이터)
  const agencies = [
    {
      id: "agency-1",
      name: "SM Pay",
      logo: "/images/SMPay_logo.png",
      status: "active",
      loginUrl: "/sign-in",
    },
    {
      id: "agency-2",
      name: "",
      logo: "/placeholder.svg?height=80&width=120",
      status: "coming-soon",
      loginUrl: "/login/agency-2",
    },
    {
      id: "agency-3",
      name: "",
      logo: "/placeholder.svg?height=80&width=120",
      status: "coming-soon",
      loginUrl: "/login/agency-3",
    },
    {
      id: "agency-4",
      name: "",
      logo: "/placeholder.svg?height=80&width=120",
      status: "coming-soon",
      loginUrl: "/login/agency-4",
    },
    {
      id: "agency-5",
      name: "",
      logo: null,
      status: "coming-soon",
      loginUrl: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <Link
          href="/"
          className="flex items-center justify-center text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
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
            className="hidden sm:inline-flex text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all"
          >
            <Link href="/">SM Pay 이용 가이드</Link>
          </Button>
          <Button className="hidden sm:inline-flex bg-gray-900 text-white hover:bg-gray-800">
            <Link href="/landing/agency-login">대행사 접속 링크</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Building2 className="size-4" />
            대행사 전용 접속
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            대행사별 SM Pay 접속 페이지
          </h1>
          <div className="max-w-2xl mx-auto space-y-3">
            <p className="text-lg text-gray-600">
              SM Pay는 각 대행사별 전용 로그인 페이지를 제공합니다.
            </p>
            <p className="text-lg text-gray-600">
              정확한 접속을 위해{" "}
              <span className="font-semibold text-blue-600">
                소속된 대행사를 선택
              </span>
              해 주세요.
            </p>
          </div>
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200 max-w-xl mx-auto">
            <p className="text-sm text-blue-700 font-medium">
              💡 대행사 로고를 클릭하면 해당 전용 로그인 페이지로 이동합니다.
            </p>
          </div>
        </div>

        {/* Agency Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {agencies.map((agency) => (
            <Card
              key={agency.id}
              className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl border-2 ${
                agency.status === "active"
                  ? "hover:border-blue-300 cursor-pointer"
                  : "border-gray-200"
              } ${hoveredCard === agency.id ? "scale-105" : ""}`}
              onMouseEnter={() => setHoveredCard(agency.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => {
                if (agency.status === "active" && agency.loginUrl) {
                  window.location.href = agency.loginUrl;
                }
              }}
            >
              <CardContent className="p-8 text-center h-48 flex flex-col justify-center items-center relative">
                {agency.status === "active" ? (
                  <>
                    <div className="mb-4 p-4 rounded-xl group-hover:bg-blue-50 transition-colors">
                      <img
                        src={agency.logo || "/placeholder.svg"}
                        alt={`${agency.name} 로고`}
                        className="h-12 w-auto mx-auto object-contain"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {agency.name}
                    </h3>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="size-4 text-blue-500" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4 p-4 rounded-xl">
                      <Clock className="size-12 text-gray-400 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-500">
                      준비 중입니다
                    </h3>
                    <p className="text-sm text-gray-400 mt-2">{agency.name}</p>
                  </>
                )}
              </CardContent>
            </Card>
          ))}

          {/* 대행사 등록 신청 카드 */}
          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 cursor-pointer hover:scale-105">
            <CardContent className="p-8 text-center h-48 flex flex-col justify-center items-center relative">
              <div className="mb-4 p-4 bg-amber-100 rounded-xl group-hover:bg-amber-200 transition-colors">
                <Plus className="size-12 text-amber-600 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-amber-800 group-hover:text-amber-900 transition-colors">
                대행사 등록 신청
              </h3>
              <p className="text-sm text-amber-700 mt-2">
                새로운 파트너십을 시작하세요
              </p>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="size-4 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Notice */}
        <div className="text-center">
          <div className="inline-block p-6 bg-white rounded-2xl shadow-sm border border-gray-200 max-w-2xl">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="size-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-600">
                파트너십 확대 중
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed">
              현재 입부 대행사만 등록되어 있으며,
              <br />
              <span className="font-semibold text-blue-600">
                다양한 파트너사와의 제휴가 순차적으로 확대될 예정
              </span>
              입니다.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">
              SM Pay 파트너가 되어보세요
            </h2>
            <p className="text-blue-100 mb-6 max-w-md mx-auto">
              혁신적인 광고비 결제 솔루션으로 함께 성장할 파트너를 찾고
              있습니다.
            </p>
            <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all">
              파트너십 문의하기
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} SM Pay. All rights reserved.
            </p>
            <nav className="flex gap-6 text-sm">
              <Link
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                이용약관
              </Link>
              <Link
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                개인정보처리방침
              </Link>
              <Link
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                고객문의
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
