// lib/slack.ts
export const sendSlackError = async ({
  email,
  name,
  userId,
  agentId,
  url,
  method,
  params,
  errorMessage,
  currentUrl,
}: {
  email?: string;
  name?: string;
  userId?: string;
  agentId?: string;
  url: string;
  method: string;
  params?: any;
  errorMessage: string;
  currentUrl: string;
}) => {
  try {
    await fetch("/api/slack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name,
        userId,
        agentId,
        url,
        method,
        params,
        errorMessage,
        currentUrl,
      }),
    });
  } catch (error) {
    console.error("❌ Slack 알림 전송 중 오류:", error);
  }
};
