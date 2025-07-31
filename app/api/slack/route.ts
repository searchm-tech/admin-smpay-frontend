import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    let requestData;
    try {
      requestData = await request.json();
    } catch (jsonError) {
      console.error("❌ JSON 파싱 실패:", jsonError);
      return NextResponse.json(
        { success: false, error: "Invalid JSON format" },
        { status: 400 }
      );
    }

    const {
      name,
      userId,
      agentId,
      url,
      method,
      params,
      errorMessage,
      currentUrl,
      email,
    } = requestData;

    const webhook = process.env.SLACK_WEBHOOK_URL; // 서버사이드에서는 NEXT_PUBLIC_ 없이 사용

    if (!webhook) {
      console.warn(
        "⚠️ SLACK_WEBHOOK_URL이 설정되지 않아 Slack 알림을 건너뜁니다."
      );
      return NextResponse.json({
        success: false,
        message: "Webhook URL not configured",
      });
    }

    const time = new Date().toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
    });

    const body = {
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `🚨 *[시스템 관리자 환경 - 에러 발생]*`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `⚠️ *[FE 정보]*`,
          },
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*사용자:*\n${userId ? `${email}/${name}` : "비회원"}`,
            },
            {
              type: "mrkdwn",
              text: `*사용자/대행사 ID:*\n${`${userId || "-"}/${agentId || "-"}`}`,
            },
            {
              type: "mrkdwn",
              text: `*페이지:*\n${currentUrl || "-"}`,
            },
            {
              type: "mrkdwn",
              text: `*시간:*\n${time}`,
            },
          ],
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `⚠️ *[BE 정보]*`,
          },
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*메서드:*\n${method.toUpperCase()}`,
            },
            {
              type: "mrkdwn",
              text: `*URL:*\n${url}`,
            },
          ],
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*요청 파라미터:*\n\`\`\`${JSON.stringify(
              params,
              null,
              2
            )}\`\`\``,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*에러 메시지:*\n\`\`\`${errorMessage}\`\`\``,
          },
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `시간: ${time}`,
            },
          ],
        },
      ],
    };

    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    console.log("📨 Slack 응답:", response.status, response.statusText);

    if (response.ok) {
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error("💥 Slack API Route에서 오류 발생:");
    console.error("  - Error type:", typeof error);
    console.error(
      "  - Error message:",
      error instanceof Error ? error.message : String(error)
    );
    console.error(
      "  - Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    return NextResponse.json(
      { success: false, error: "Failed to send slack notification" },
      { status: 500 }
    );
  }
}
