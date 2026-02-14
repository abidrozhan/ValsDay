import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface QuizAnswerPayload {
    questionId: number;
    question: string;
    answer: string;
    selectedOption?: string;
}

export async function POST(request: Request) {
    try {
        const { answers } = (await request.json()) as {
            answers: QuizAnswerPayload[];
        };

        if (!answers || !Array.isArray(answers)) {
            return NextResponse.json(
                { error: "Invalid payload" },
                { status: 400 }
            );
        }

        // Build email HTML
        const answersHtml = answers
            .map(
                (a, i) => `
        <div style="margin-bottom: 20px; padding: 16px; background: #fff5f7; border-radius: 12px; border-left: 4px solid #ff8fab;">
          <p style="margin: 0 0 8px; font-weight: 600; color: #4a2040;">
            Q${i + 1}: ${a.question}
          </p>
          <p style="margin: 0; color: #7a4068;">
            ${a.selectedOption ? `<span style="color: #e05885;">[${a.selectedOption}]</span> ` : ""}${a.answer}
          </p>
        </div>`
            )
            .join("");

        const html = `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h1 style="text-align: center; color: #e05885; font-size: 24px;">
          💕 Quiz Match Results — Kayla Saldrina
        </h1>
        <p style="text-align: center; color: #7a4068; margin-bottom: 24px;">
          She completed the Valentine Quiz! Here are her answers:
        </p>
        ${answersHtml}
        <p style="text-align: center; color: #b06090; margin-top: 24px; font-style: italic;">
          Sent from Valentine Website 💌
        </p>
      </div>`;

        // Check if email credentials are configured
        const emailUser = process.env.EMAIL_USER;
        const emailPass = process.env.EMAIL_PASS;

        if (!emailUser || !emailPass) {
            // Log answers to console if no email credentials
            console.log("=== QUIZ ANSWERS (email not configured) ===");
            answers.forEach((a, i) => {
                console.log(`Q${i + 1}: ${a.question}`);
                console.log(`A: ${a.answer}`);
                console.log("---");
            });
            return NextResponse.json({
                success: true,
                note: "Email credentials not configured. Answers logged to console.",
            });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: emailUser,
                pass: emailPass,
            },
        });

        await transporter.sendMail({
            from: `"Valentine Quiz 💕" <${emailUser}>`,
            to: "abidrozhann@gmail.com",
            subject: "💕 Kayla's Quiz Match Results",
            html,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Email send error:", error);
        return NextResponse.json(
            { error: "Failed to send email" },
            { status: 500 }
        );
    }
}
