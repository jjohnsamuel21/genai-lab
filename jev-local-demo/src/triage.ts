import { choice, noul, score, TypeSafeClient } from "@typesafe-ai/sdk";

export type SupportTriage = {
  department: string;
  departmentProbabilities: Record<string, number>;
  departmentConfidence: number;

  urgent: number;

  severity: number;
  severityConfidence: number;
};

const client = new TypeSafeClient();

export async function triageSupportMessage(
  message: string
): Promise<SupportTriage> {
  const response = await client.systemOne({
    model: "jev-latest",

    state: {
      message,
    },

    questions: {
      department: choice(
        "Which department should handle this customer request?",
        {
          billing:
            "Issues involving charges, invoices, refunds, payments, subscriptions or duplicate charges.",

          technical:
            "Software bugs, errors, outages, integrations, APIs or technical failures.",

          account:
            "Account access, profile changes, login, password or account-management requests.",

          other:
            "The request does not clearly belong to billing, technical support or account support.",
        }
      ),

      urgent: noul(
        "Does the customer explicitly communicate that the issue requires immediate or time-sensitive attention?"
      ),

      severity: score(
        "How severe is the customer issue based on its likely impact if it is not addressed promptly?",
        [
          "Low: minor inconvenience with little or no immediate impact.",
          "Medium: meaningful disruption affecting the customer but with a reasonable workaround.",
          "High: major business impact, service outage, financial impact or inability to perform an important operation.",
        ]
      ),
    },
  });

  const department = response.answers.department;
  const urgent = response.answers.urgent;
  const severity = response.answers.severity;

  return {
    department: department.choice,
    departmentProbabilities: department.probabilities,
    departmentConfidence: department.confidence,

    urgent: urgent.noul,

    severity: severity.value,
    severityConfidence: severity.confidence,
  };
}