import { GuideBox } from "@/components/common/Box";
import { IconBadge } from "@/components/composite/icon-components";

const GuidSection = () => {
  return (
    <GuideBox>
      <section className="w-full flex items-center text-[13px]">
        <div className="w-full flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <IconBadge name="CircleAlert" bgColor="#1062FF" />
            <span>키워드 보고서 도움말</span>
          </div>

          <div className="pl-6 text-[#363C45] space-y-1.5 flex flex-col">
            <span>
              • 더욱 상세한 키워드 정보를 확인하고자 할 경우, [광고주 세부 검색]
              기능을 통해 그룹원 또는 광고주 범위를 선택해 조회해 주세요.
            </span>
            <span>
              • [엑셀 다운로드] 기능을 통해 최대 100,000개의 키워드 데이터를
              내려받을 수 있습니다.
            </span>
          </div>
        </div>
      </section>{" "}
    </GuideBox>
  );
};

export default GuidSection;
