import "dotenv/config";

import { triageSupportMessage } from "./triage.js";

async function main() {
  const message =
    "I was charged twice for my subscription and I need this fixed immediately. The duplicate payment is affecting my account.";

  console.log("\n=================================");
  console.log("        CUSTOMER MESSAGE");
  console.log("=================================\n");

  console.log(message);

  console.log("\nCalling Jev...\n");

  const result = await triageSupportMessage(message);

  console.log("=================================");
  console.log("             JEV RESULT");
  console.log("=================================\n");

  console.log("Department:");
  console.log(`  ${result.department}`);

  console.log("\nDepartment probabilities:");
  console.table(result.departmentProbabilities);

  console.log("Department confidence:");
  console.log(`  ${result.departmentConfidence}`);

  console.log("\nUrgency probability:");
  console.log(`  ${result.urgent}`);

  console.log("\nSeverity score:");
  console.log(`  ${result.severity}`);

  console.log("\nSeverity confidence:");
  console.log(`  ${result.severityConfidence}`);

  console.log("\n=================================");
  console.log("        APPLICATION DECISION");
  console.log("=================================\n");

  if (result.urgent >= 0.8 || result.severity >= 2.2) {
    console.log("⚠️ HUMAN REVIEW REQUIRED");
  } else {
    console.log("✅ AUTOMATIC ROUTING");
  }
}

main().catch((error) => {
  console.error("\nJev request failed:\n");
  console.error(error);

  process.exit(1);
});