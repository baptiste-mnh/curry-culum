import { Download, Check } from "lucide-react";
import { Button } from "./button";
import { usePWA } from "@/hooks/usePWA";

export const InstallPWAButton = () => {
  const { isInstallable, isInstalled, installApp } = usePWA();

  if (isInstalled) {
    return (
      <Button variant="outline" disabled className="gap-2">
        <Check className="h-4 w-4" />
        App installed
      </Button>
    );
  }

  if (!isInstallable) {
    return (
      <div className="flex flex-col items-center justify-center p-2 rounded-2xl border-1 bg-gray-100">
        <p>Open it from your mobile browser to install it.</p>
      </div>
    );
  }

  return (
    <Button
      onClick={installApp}
      variant="default"
      className="gap-2 bg-amber-500 hover:bg-amber-600"
    >
      <Download className="h-4 w-4" />
      Install the app
    </Button>
  );
};
