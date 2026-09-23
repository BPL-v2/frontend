import { createFileRoute } from "@tanstack/react-router";
import { SubmissionsPage } from "@components/pages/submissions-page";
import { usePageSEO } from "@utils/use-seo";

export const Route = createFileRoute("/submissions")({
  component: SubmissionPage,
});

function SubmissionPage() {
  usePageSEO("submissions");
  return <SubmissionsPage />;
}
