import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GuideSection = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-[#FFF1DE] border-[#FFDAA6]">
        <CardHeader>
          <CardTitle>SM Pay - 이용 가이드</CardTitle>
        </CardHeader>
        <CardContent>
          중소사업자를 위한 스마트한 광고비 관리 솔루션! <br />
          이용 가이드를 참고해 쉽게 시작해보세요.
        </CardContent>
      </Card>
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle>네이버 마케팅 / 광고주 등록</CardTitle>
        </CardHeader>
        <CardContent>
          SM Pay 서비스를 이용하려면 먼저 네이버 마케터 라이선스 등록과 광고주
          계정 등록을 완료해주세요.
        </CardContent>
      </Card>
    </section>
  );
};

export default GuideSection;
