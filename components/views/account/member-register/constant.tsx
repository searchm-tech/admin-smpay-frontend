export const DialogContent = {
  err: "모든 필수 항목을 입력해주세요.",
  success: (
    <div className="text-center">
      <p>메일 발송이 완료되었습니다.</p>
      <p>초대 링크는 전송 후 3일이 지나면 만료됩니다.</p>
    </div>
  ),
  "success-direct": (
    <div className="text-center">
      <p>회원가입 정보가 등록하신 이메일 주소로 발송되었습니다.</p>
      <p>담당자에게 이메일을 확인을 요청해주세요.</p>
    </div>
  ),
  department: "부서 선택을 해주세요.",
  emailRegex: "이메일 형식이 올바르지 않습니다.",
  nameCheck: "중복 체크를 해주세요.",
  "check-email-empty": "이메일 주소를 입력해주세요.",
  "check-email-regex": "이메일 형식이 올바르지 않습니다.",
  "password-regex":
    "비밀번호가 영문, 숫자, 특수문자가 모두 들어간 8-16자가 아닙니다.",
  "password-confirm": "비밀번호가 일치하지 않습니다.",
  "phone-regex": "전화번호가 올바르지 않습니다.",
  "agency-select": "대행사를 선택해주세요.",
  "name-empty": "이름을 입력해주세요.",
  "member-type": "회원 구분을 선택해주세요.",
  "department-select": "부서를 선택해주세요.",
  "password-empty": "비밀번호를 입력해주세요.",
};

export type DialogContentType = keyof typeof DialogContent;

export const DialogContentEmail = {
  "available-email": "사용 가능한 이메일 주소입니다.",
  "duplicate-email": "이미 존재하는 이메일 주소입니다.",
  "agency-select": "대행사를 선택해주세요.",
};

export type DialogContentTypeEmail = keyof typeof DialogContentEmail;
