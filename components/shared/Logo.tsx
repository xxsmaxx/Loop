import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";

interface PrimaryButtonProps {
  children: ReactNode;
}

export default function PrimaryButton({ children }: PrimaryButtonProps) {
  return (
    <Button className="rounded-xl bg-blue-600 px-6 py-6 text-base font-semibold text-white transition-all hover:scale-105 hover:bg-blue-700">
      {children}
      <ArrowRight className="ml-2 h-5 w-5" />
    </Button>
  );
}