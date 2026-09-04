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
} from '@hubspot/ui-extensions';

interface CrmExtensionProps {
  context: CrmContext;
  actions: ExtensionPointApiActions<'crm.record.tab'>;
}

hubspot.extend<'crm.record.tab'>(({ context, actions }: CrmExtensionProps) => (
  <DealExtension context={context} actions={actions} />
));

const DealExtension = ({ context }: CrmExtensionProps) => {
  const dealId = context.crm.objectId ? String(context.crm.objectId) : 'deal-001';
  const portalId = context.portal.id ? String(context.portal.id) : '245209885';

  const intelligenceUrl = `https://dealsense-ai.peash.tech/?dealId=${dealId}&portalId=${portalId}`;
  const dashboardUrl = `https://dealsense.peash.tech/deals`;

  return (
    <Flex direction="column" gap="medium">
      <Alert title="Deal Risk Detected" variant="warning">
        DealSense AI detected 18 days of stakeholder silence. Suggested Action: Trigger Executive Alignment Playbook.
      </Alert>

      <Tile>
        <Flex direction="column" gap="medium">
          <Flex justify="between" align="center">
            <Heading>DealSense Intelligence</Heading>
            <StatusTag variant="success">Active AI Engine</StatusTag>
          </Flex>

          <Text variant="microcopy">
            Autonomous revenue intelligence, velocity scoring, and MEDDICC risk assessment.
          </Text>

          <Box>
            <Flex justify="between" align="end" marginBottom="x-small">
              <Text>Health Score</Text>
              <Heading>64 / 100</Heading>
            </Flex>
            <ProgressBar value={64} showValue={false} title="Health Score" />
          </Box>

          <Statistics>
            <StatisticsItem label="Velocity Trend" number="Critical" />
            <StatisticsItem label="Stakeholder Coverage" number="45%" />
            <StatisticsItem label="Revenue at Risk" number="$125k" />
          </Statistics>

          <Divider />

          <Flex direction="row" gap="medium" align="center">
            <Button
              variant="primary"
              onClick={() => {
                window.open(intelligenceUrl, '_blank');
              }}
            >
              Open Deal Dossier ↗
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                window.open(dashboardUrl, '_blank');
              }}
            >
              View Pipeline
            </Button>
          </Flex>
        </Flex>
      </Tile>

      <Box>
        <Text format={{ italic: true }} variant="microcopy">
          Live deal telemetry synced via DealSense AI ·{' '}
          <Link href="https://dealsense.peash.tech/compliance">
            Enterprise Compliance &amp; Audit
          </Link>
        </Text>
      </Box>
    </Flex>
  );
};
