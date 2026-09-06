import {
  CrmContext,
  ExtensionPointApiActions,
  Flex,
  Text,
  Button,
  StatusTag,
  hubspot,
  LoadingSpinner,
  ErrorState,
} from "@hubspot/ui-extensions";
import React, { useEffect, useState } from "react";

interface CrmExtensionProps {
  context: CrmContext;
  actions: ExtensionPointApiActions<"crm.record.sidebar">;
  runServerlessFunction: any;
}

hubspot.extend<"crm.record.sidebar">(({ context, actions, runServerlessFunction }) => (
  <DealSidebarExtension context={context} actions={actions} runServerlessFunction={runServerlessFunction} />
));

const DealSidebarExtension = ({ context, actions, runServerlessFunction }: CrmExtensionProps) => {
  const [snapshot, setSnapshot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSnapshot = async () => {
    try {
      setLoading(true);
      setError(null);
      const dealId = context.crm.objectId;
      const portalId = context.portal.id;
      
      // We use hubspot.fetch which is allowed by permittedUrls
      const response = await hubspot.fetch(`https://dealsense-api-6o2h.onrender.com/api/v1/deals/${dealId}/snapshot`, {
        method: "GET",
        headers: {
          "X-HubSpot-Portal-Id": String(portalId),
        },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
           setSnapshot(null);
           return;
        }
        throw new Error(`Failed to fetch deal intelligence (HTTP ${response.status})`);
      }
      
      const data = await response.json();
      setSnapshot(data);
    } catch (err: any) {
      setError(err.message || "An error occurred fetching deal intelligence.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnapshot();
  }, [context.crm.objectId]);

  if (loading) {
    return <LoadingSpinner label="Analyzing deal telemetry..." size="small" />;
  }

  if (error) {
    return (
      <ErrorState title="Telemetry Error" type="warning">
        <Text>{error}</Text>
        <Button onClick={fetchSnapshot} variant="secondary">Retry</Button>
      </ErrorState>
    );
  }

  if (!snapshot) {
    return (
      <Flex direction="column" gap="small" align="start">
        <Text variant="microcopy">DealSense has not analyzed this deal yet.</Text>
        <Button 
          variant="primary" 
          onClick={async () => {
             // In a full implementation, this would trigger a score run. 
             // For now we'll just redirect to the tab.
             // (Wait, sidebar cards can't open tabs directly, but we can instruct the user)
          }}
        >
          Initialize AI Scoring
        </Button>
      </Flex>
    );
  }

  // Determine variant for StatusTag based on risk band
  const getBandVariant = (band: string) => {
    switch (band) {
      case "critical": return "error";
      case "high": return "warning";
      case "healthy": return "success";
      default: return "default";
    }
  };

  const delta = snapshot.score_delta || 0;
  const deltaText = delta > 0 ? `▲ +${delta}` : delta < 0 ? `▼ ${delta}` : "No change";

  return (
    <Flex direction="column" gap="medium">
      <Flex direction="row" align="center" justify="between">
        <Flex direction="column" gap="extra-small">
           <Text variant="microcopy">Health Score</Text>
           <Text format={{ fontWeight: "bold" }}>{snapshot.health_score} / 100</Text>
        </Flex>
        <StatusTag variant={getBandVariant(snapshot.risk_band)}>
          {snapshot.risk_band.toUpperCase()}
        </StatusTag>
      </Flex>
      
      <Flex justify="between">
         <Text variant="microcopy">Recent Trend:</Text>
         <Text variant="microcopy" format={{ fontWeight: "bold", textColor: delta > 0 ? "success" : delta < 0 ? "error" : "default" }}>
           {deltaText}
         </Text>
      </Flex>

      {snapshot.top_signals && snapshot.top_signals.length > 0 && (
        <Flex direction="column" gap="extra-small">
          <Text variant="microcopy" format={{ italic: true }}>Top Risk Factor:</Text>
          <Text variant="microcopy">{snapshot.top_signals[0].signal_name.replace(/_/g, " ")}</Text>
        </Flex>
      )}

      <Button
        variant="secondary"
        onClick={() => {
          // Instruct user to open the tab
        }}
      >
        View Full Intelligence Tab
      </Button>
    </Flex>
  );
};
