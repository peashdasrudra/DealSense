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
      <Tile>
        <Flex direction="column" gap="small">
          <Flex justify="between" align="center">
            <Heading>DealSense Intelligence</Heading>
            <StatusTag variant="success">Active AI Engine</StatusTag>
          </Flex>

          <Text>
            Autonomous revenue intelligence, velocity scoring, and MEDDICC risk assessment for this deal.
          </Text>

          <Divider />

          <Flex direction="row" gap="medium" align="center">
            <Button
              variant="primary"
              onClick={() => {
                window.open(intelligenceUrl, '_blank');
              }}
            >
              Open Deal Intelligence Dossier ↗
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                window.open(dashboardUrl, '_blank');
              }}
            >
              View Pipeline Waterfall
            </Button>
          </Flex>
        </Flex>
      </Tile>

      <Box>
        <Text format={{ italic: true }}>
          Live deal telemetry synced via DealSense AI ·{' '}
          <Link href="https://dealsense.peash.tech/compliance">
            Enterprise Compliance &amp; Audit
          </Link>
        </Text>
      </Box>
    </Flex>
  );
};
