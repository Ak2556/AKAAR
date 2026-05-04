import type { RuntimeCapabilities } from "@/lib/runtime-capabilities";

export function DevelopmentSetupBanner({
  capabilities,
}: {
  capabilities: RuntimeCapabilities;
}) {
  if (
    !capabilities.isDevelopment ||
    (!capabilities.localDataMode && capabilities.missingConfig.length === 0)
  ) {
    return null;
  }

  return (
    <div className="border-b border-amber-500/30 bg-amber-500/10">
      <div className="container mx-auto px-6 py-3 text-sm text-amber-200">
        <span className="font-semibold">Local setup mode:</span>{" "}
        {capabilities.localDataMode
          ? "the storefront is using the local JSON data store instead of Docker/Postgres."
          : "some features are running in fallback mode."}
        {capabilities.missingConfig.length > 0
          ? ` Missing or partial variables: ${capabilities.missingConfig.join(", ")}.`
          : null}
      </div>
    </div>
  );
}
