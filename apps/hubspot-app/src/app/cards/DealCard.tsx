import {
  CrmContext,
  ExtensionPointApiActions,
  Flex,
  Heading,
  Text,
  Button,
  Box,
  Tile,
  StatusTag,
  Link,
  hubspot,
  Alert,
  ProgressBar,
  Statistics,
  StatisticsItem,
  LoadingSpinner,
  ErrorState,
  EmptyState,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Accordion,
  Tag,
} from '@hubspot/ui-extensions';
import React, { useEffect, useState } from 'react';

interface CrmExtensionProps {
  context: CrmContext;
  actions: ExtensionPointApiActions<'crm.record.tab'>;
  runServerlessFunction: any;
}

hubspot.extend<'crm.record.tab'>(({ context, actions, runServerlessFunction }: CrmExtensionProps) => (
  <DealExtension context={context} actions={actions} runServerlessFunction={runServerlessFunction} />
));

const DealExtension = ({ context }: CrmExtensionProps) => {
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

  const handleAnalyzeDeal = async () => {
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
      setError(err.message || 'Failed to complete deal analysis.');
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    fetchSnapshot();
  }, [dealId]);

  if (loading || analyzing) {
    return (
      <LoadingSpinner
        label={analyzing ? 'DealSense AI analyzing deal telemetry & signals...' : 'Loading DealSense Intelligence...'}
        size="medium"
        layout="centered"
      />
    );
  }

  if (error) {
    return (
      <ErrorState title="Telemetry Error" type="error">
        <Text>{error}</Text>
        <Button onClick={fetchSnapshot} variant="secondary">
          Retry Connection
        </Button>
      </ErrorState>
    );
  }

  if (!snapshot) {
    return (
      <EmptyState
        title="Deal Not Yet Analyzed"
        imageName="deals"
        layout="vertical"
      >
        <Flex direction="column" gap="medium" align="center">
          <Text>
            DealSense has not processed telemetry for this deal yet. Run an autonomous risk and MEDDICC qualification analysis now.
          </Text>
          <Button variant="primary" onClick={handleAnalyzeDeal}>
            Analyze Deal Now
          </Button>
        </Flex>
      </EmptyState>
    );
  }

  const getRiskStatusVariant = (band: string): 'danger' | 'warning' | 'info' | 'success' | 'default' => {
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

  const getAlertVariant = (band: string): 'error' | 'warning' | 'info' | 'success' => {
    switch (band?.toLowerCase()) {
      case 'critical':
        return 'error';
      case 'high':
      case 'elevated':
        return 'warning';
      case 'moderate':
        return 'info';
      case 'healthy':
        return 'success';
      default:
        return 'info';
    }
  };

  const getProgressVariant = (score: number): 'success' | 'warning' | 'danger' => {
    if (score >= 70) return 'success';
    if (score >= 40) return 'warning';
    return 'danger';
  };

  const dashboardUrl = `https://dealsense-ai.peash.tech/deals/${dealId}`;
  const riskBand = snapshot.risk_band ? snapshot.risk_band.toUpperCase() : 'UNKNOWN';
  const scoreDelta = snapshot.score_delta || 0;
  const deltaFormatted = scoreDelta > 0 ? `+${scoreDelta}` : `${scoreDelta}`;

  return (
    <Flex direction="column" gap="large">
      {/* 1. Risk Narrative Alert */}
      <Alert title={`Deal Risk Assessment: ${riskBand}`} variant={getAlertVariant(snapshot.risk_band)}>
        {snapshot.risk_narrative || 'Autonomous telemetry evaluation completed. Review signals below.'}
      </Alert>

      {/* 2. Health Score & Key Statistics */}
      <Tile>
        <Flex direction="column" gap="medium">
          <Flex justify="between" align="center">
            <Heading>Health Overview</Heading>
            <StatusTag variant={getRiskStatusVariant(snapshot.risk_band)}>
              {`${snapshot.health_score ?? 0} / 100 — ${riskBand}`}
            </StatusTag>
          </Flex>

          <Box>
            <ProgressBar
              value={Number(snapshot.health_score) || 0}
              maxValue={100}
              variant={getProgressVariant(Number(snapshot.health_score) || 0)}
              title="Health Score Gauge"
            />
          </Box>

          <Statistics>
            <StatisticsItem label="Score Trend" number={deltaFormatted} />
            <StatisticsItem label="Signals Detected" number={`${snapshot.top_signals ? snapshot.top_signals.length : 0}`} />
            <StatisticsItem
              label="Last Computed"
              number={snapshot.computed_at ? new Date(snapshot.computed_at).toLocaleDateString() : 'Just now'}
            />
          </Statistics>
        </Flex>
      </Tile>

      {/* 3. Detected Risk Signals Accordion */}
      {snapshot.top_signals && snapshot.top_signals.length > 0 && (
        <Tile>
          <Flex direction="column" gap="medium">
            <Heading>Detected Risk Signals</Heading>
            {snapshot.top_signals.map((signal: any, idx: number) => (
              <Accordion
                key={idx}
                title={`${signal.signal_name ? signal.signal_name.replace(/_/g, ' ').toUpperCase() : 'SIGNAL'} (${signal.severity ? signal.severity.toUpperCase() : 'INFO'})`}
                defaultOpen={idx === 0}
              >
                <Flex direction="column" gap="small">
                  <Flex justify="between" align="center">
                    <Text format={{ fontWeight: 'bold' }}>Severity Level</Text>
                    <StatusTag variant={getRiskStatusVariant(signal.severity)}>
                      {signal.severity ? signal.severity.toUpperCase() : 'INFO'}
                    </StatusTag>
                  </Flex>
                  <Text>{signal.description || signal.reason || 'No detailed description.'}</Text>
                  {signal.weight !== undefined && (
                    <Text variant="microcopy" format={{ italic: true }}>
                      Score Impact Weight: {signal.weight}
                    </Text>
                  )}
                </Flex>
              </Accordion>
            ))}
          </Flex>
        </Tile>
      )}

      {/* 4. MEDDICC Qualification Matrix */}
      {snapshot.meddicc_matrix && (
        <Tile>
          <Flex direction="column" gap="medium">
            <Heading>MEDDICC Qualification</Heading>
            <Table bordered={true}>
              <TableHead>
                <TableRow>
                  <TableCell>Dimension</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(snapshot.meddicc_matrix).map(([key, value]: [string, any]) => {
                  const statusVal = String(value).toLowerCase();
                  const tagVariant: 'success' | 'warning' | 'error' | 'default' =
                    statusVal === 'confirmed' ? 'success' :
                    statusVal === 'identified' ? 'warning' :
                    statusVal === 'missing' ? 'error' : 'default';

                  return (
                    <TableRow key={key}>
                      <TableCell>
                        <Text format={{ fontWeight: 'bold' }}>{key.toUpperCase()}</Text>
                      </TableCell>
                      <TableCell>
                        <Tag variant={tagVariant}>
                          {String(value).toUpperCase()}
                        </Tag>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Flex>
        </Tile>
      )}

      {/* 5. Recommended Actions & Next Steps */}
      <Tile>
        <Flex direction="column" gap="medium">
          <Heading>Next Best Actions & RevOps Playbooks</Heading>
          <Text>
            Autonomous RevOps engine has evaluated real-time CRM stage velocity and buyer commitment gaps.
          </Text>
          <Flex direction="row" gap="medium" align="center">
            <Button
              variant="primary"
              href={{
                url: dashboardUrl,
                external: true,
              }}
            >
              Open Command Deck for Approvals
            </Button>
            <Button
              variant="secondary"
              onClick={handleAnalyzeDeal}
            >
              Re-Analyze Deal Telemetry
            </Button>
          </Flex>
        </Flex>
      </Tile>

      {/* 6. Footer Compliance */}
      <Box>
        <Text format={{ italic: true }} variant="microcopy">
          Autonomous intelligence powered by DealSense AI ·{' '}
          <Link href="https://dealsense.peash.tech/compliance">
            Enterprise Compliance &amp; Audit
          </Link>
        </Text>
      </Box>
    </Flex>
  );
};
