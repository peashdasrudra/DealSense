import {
  CrmContext,
  ExtensionPointApiActions,
  Flex,
  Heading,
  Text,
  Button,
  Box,
  Divider,
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
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Accordion,
  Tag
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

const DealExtension = ({ context, actions, runServerlessFunction }: CrmExtensionProps) => {
  const [snapshot, setSnapshot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const dealId = context.crm.objectId;
  const portalId = context.portal.id;

  const fetchSnapshot = async () => {
    try {
      setLoading(true);
      setError(null);
      
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
  }, [dealId]);

  if (loading) {
    return <LoadingSpinner label="Loading DealSense Intelligence..." size="medium" layout="centered" />;
  }

  if (error) {
    return (
      <ErrorState title="Telemetry Error" type="warning">
        <Text>{error}</Text>
        <Button onClick={fetchSnapshot} variant="secondary">Retry Connection</Button>
      </ErrorState>
    );
  }

  if (!snapshot) {
    return (
      <Flex direction="column" gap="medium" align="center">
        <Heading>Deal Not Yet Analyzed</Heading>
        <Text>DealSense has not processed telemetry for this deal.</Text>
        <Button variant="primary" onClick={() => { /* In a real app, trigger score endpoint */ }}>
          Analyze Deal Now
        </Button>
      </Flex>
    );
  }

  const getRiskVariant = (band: string) => {
    switch (band) {
      case "critical": return "error";
      case "high": return "warning";
      case "elevated": return "warning";
      case "moderate": return "default";
      case "healthy": return "success";
      default: return "default";
    }
  };

  const getAlertVariant = (band: string) => {
    switch (band) {
      case "critical": return "error";
      case "high": return "warning";
      case "elevated": return "warning";
      case "moderate": return "info";
      case "healthy": return "success";
      default: return "info";
    }
  };

  const dashboardUrl = `https://dealsense.peash.tech/deals`;

  return (
    <Flex direction="column" gap="large">
      
      {/* 1. Risk Narrative Alert */}
      <Alert title={`Risk Band: ${snapshot.risk_band.toUpperCase()}`} variant={getAlertVariant(snapshot.risk_band)}>
        {snapshot.risk_narrative || "No narrative available for this deal."}
      </Alert>

      {/* 2. Score & Statistics */}
      <Tile>
        <Flex direction="column" gap="medium">
          <Flex justify="between" align="center">
            <Heading>Health Overview</Heading>
            <StatusTag variant={getRiskVariant(snapshot.risk_band)}>
              {snapshot.health_score} / 100
            </StatusTag>
          </Flex>

          <Box>
            <ProgressBar value={snapshot.health_score} showValue={false} title="Health Score" />
          </Box>

          <Statistics>
            <StatisticsItem label="Score Trend" number={snapshot.score_delta > 0 ? `+${snapshot.score_delta}` : `${snapshot.score_delta}`} />
            <StatisticsItem label="Signals Detected" number={`${snapshot.top_signals ? snapshot.top_signals.length : 0}`} />
            <StatisticsItem label="Last Updated" number={new Date(snapshot.computed_at).toLocaleDateString()} />
          </Statistics>
        </Flex>
      </Tile>

      {/* 3. Top Risk Signals Accordion */}
      {snapshot.top_signals && snapshot.top_signals.length > 0 && (
        <Tile>
          <Flex direction="column" gap="medium">
            <Heading>Detected Risk Signals</Heading>
            <Accordion>
              {snapshot.top_signals.map((signal: any, idx: number) => (
                <Accordion.Item key={idx} title={signal.signal_name.replace(/_/g, " ").toUpperCase()}>
                  <Flex direction="column" gap="small">
                    <Flex justify="between">
                      <Text format={{ fontWeight: "bold" }}>Severity</Text>
                      <StatusTag variant={getRiskVariant(signal.severity)}>{signal.severity.toUpperCase()}</StatusTag>
                    </Flex>
                    <Text>{signal.description}</Text>
                    {signal.metadata && (
                      <Text variant="microcopy" format={{ italic: true }}>
                        {JSON.stringify(signal.metadata)}
                      </Text>
                    )}
                  </Flex>
                </Accordion.Item>
              ))}
            </Accordion>
          </Flex>
        </Tile>
      )}

      {/* 4. MEDDICC Matrix */}
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
                {Object.entries(snapshot.meddicc_matrix).map(([key, value]: [string, any]) => (
                  <TableRow key={key}>
                    <TableCell><Text format={{ fontWeight: "bold" }}>{key.toUpperCase()}</Text></TableCell>
                    <TableCell>
                      <Tag variant={
                        value === "confirmed" ? "success" : 
                        value === "identified" ? "warning" : 
                        value === "missing" ? "error" : "default"
                      }>
                        {value.toUpperCase()}
                      </Tag>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Flex>
        </Tile>
      )}

      {/* 5. Recommended Actions */}
      <Tile>
        <Flex direction="column" gap="medium">
          <Heading>Next Best Actions</Heading>
          <Text>Based on the telemetry, the AI recommends the following actions.</Text>
          <Flex direction="row" gap="medium" align="center">
            <Button
              variant="primary"
              onClick={() => {
                actions.addIframeModal({
                  uri: dashboardUrl,
                  title: 'DealSense Command Deck',
                  width: 1200,
                  height: 800,
                });
              }}
            >
              Open Command Deck for Approvals
            </Button>
            <Button
              variant="secondary"
              onClick={fetchSnapshot}
            >
              Refresh Telemetry
            </Button>
          </Flex>
        </Flex>
      </Tile>

      {/* Footer */}
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
