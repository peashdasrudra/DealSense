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
} from '@hubspot/ui-extensions';
import React, { useEffect, useState } from 'react';

interface CrmExtensionProps {
  context: CrmContext;
  actions: ExtensionPointApiActions<'crm.record.sidebar'>;
  runServerlessFunction: any;
}

hubspot.extend<'crm.record.sidebar'>(({ context, actions, runServerlessFunction }: CrmExtensionProps) => (
  <DealSidebarExtension context={context} actions={actions} runServerlessFunction={runServerlessFunction} />
));

const DealSidebarExtension = ({ context }: CrmExtensionProps) => {
  const [snapshot, setSnapshot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dealId = context.crm.objectId;
  const portalId = context.portal.id;

  const fetchSnapshot = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await hubspot.fetch(`https://dealsense-api-6o2h.onrender.com/api/v1/deals/${dealId}/snapshot`, {
        method: 'GET',
        headers: {
          'X-HubSpot-Portal-Id': String(portalId),
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
      setError(err.message || 'An error occurred fetching deal intelligence.');
    } finally {
      setLoading(false);
    }
  };

  const handleScoreDeal = async () => {
    try {
      setAnalyzing(true);
      setError(null);

      const response = await hubspot.fetch(`https://dealsense-api-6o2h.onrender.com/api/v1/deals/${dealId}/score`, {
        method: 'POST',
        headers: {
          'X-HubSpot-Portal-Id': String(portalId),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Scoring analysis failed (HTTP ${response.status})`);
      }

      const newSnapshot = await response.json();
      setSnapshot(newSnapshot);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze deal.');
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    fetchSnapshot();
  }, [dealId]);

  if (loading || analyzing) {
    return <LoadingSpinner label={analyzing ? 'Scoring deal...' : 'Analyzing telemetry...'} size="small" />;
  }

  if (error) {
    return (
      <ErrorState title="Telemetry Error" type="error">
        <Text>{error}</Text>
        <Button onClick={fetchSnapshot} variant="secondary">
          Retry
        </Button>
      </ErrorState>
    );
  }

  if (!snapshot) {
    return (
      <Flex direction="column" gap="small" align="start">
        <Text variant="microcopy">DealSense has not analyzed this deal yet.</Text>
        <Button
          variant="primary"
          onClick={handleScoreDeal}
        >
          Initialize AI Scoring
        </Button>
      </Flex>
    );
  }

  const getBandVariant = (band: string): 'danger' | 'warning' | 'info' | 'success' | 'default' => {
    switch (band?.toLowerCase()) {
      case 'critical':
        return 'danger';
      case 'high':
      case 'elevated':
        return 'warning';
      case 'moderate':
        return 'info';
      case 'healthy':
        return 'success';
      default:
        return 'default';
    }
  };

  const delta = snapshot.score_delta || 0;
  const deltaText = delta > 0 ? `▲ +${delta}` : delta < 0 ? `▼ ${delta}` : 'No change';
  const dashboardUrl = `https://dealsense-ai.peash.tech/deals/${dealId}`;

  return (
    <Flex direction="column" gap="medium">
      <Flex direction="row" align="center" justify="between">
        <Flex direction="column" gap="extra-small">
          <Text variant="microcopy">Health Score</Text>
          <Text format={{ fontWeight: 'bold' }}>{snapshot.health_score ?? 0} / 100</Text>
        </Flex>
        <StatusTag variant={getBandVariant(snapshot.risk_band)}>
          {snapshot.risk_band ? snapshot.risk_band.toUpperCase() : 'UNKNOWN'}
        </StatusTag>
      </Flex>

      <Flex justify="between" align="center">
        <Text variant="microcopy">Recent Trend:</Text>
        <Text variant="microcopy" format={{ fontWeight: 'bold' }}>
          {deltaText}
        </Text>
      </Flex>

      {snapshot.top_signals && snapshot.top_signals.length > 0 && (
        <Flex direction="column" gap="extra-small">
          <Text variant="microcopy" format={{ italic: true }}>Top Risk Factor:</Text>
          <Text variant="microcopy">
            {snapshot.top_signals[0].signal_name ? snapshot.top_signals[0].signal_name.replace(/_/g, ' ') : 'Risk detected'}
          </Text>
        </Flex>
      )}

      <Button
        variant="secondary"
        href={{
          url: dashboardUrl,
          external: true,
        }}
      >
        View Full Intelligence Tab
      </Button>
    </Flex>
  );
};
