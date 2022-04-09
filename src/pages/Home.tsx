import {
  Button,
  Card,
  Code,
  createStyles,
  Grid,
  Group,
  Text
} from "@mantine/core";
import { Page } from "../App";

function Home({ setPage }: { setPage: (page: Page) => void }) {
  const { classes } = useStyles();
  return <Grid mt={120}>
    <Grid.Col xs={12} md={6}>
      <Card withBorder radius="md" mx={32} className={classes.card}>
        <Card.Section className={classes.section}>
          <Group position="apart">
            <Text size="lg" weight={500}>
              Compress Image
            </Text>
          </Group>
          <Text size="sm" mt="xs">
            I have a <Code mx={8}>.bmp</Code> image and I want
            to compress it.
            You can find out how haar wavelet compression works!
          </Text>
        </Card.Section>
        <Group mt="xs">
          <Button
            radius="md"
            style={{ flex: 1 }}
            onClick={() => setPage(Page.UploadBmp)}
          >
            Upload <Code mx={8}>.bmp</Code> file
          </Button>
        </Group>
      </Card>
    </Grid.Col>
    <Grid.Col xs={12} md={6}>
      <Card withBorder radius="md" mx={32} className={classes.card}>
        <Card.Section className={classes.section}>
          <Group position="apart">
            <Text size="lg" weight={500}>
              Decompress Image
            </Text>
          </Group>
          <Text size="sm" mt="xs">
            I have a <Code mx={8}>.compressed</Code> image and I
            want to decompress
            it into <Code mx={8}>.bmp</Code> file!
          </Text>
        </Card.Section>
        <Group mt="xs">
          <Button
            radius="md"
            style={{ flex: 1 }}
            onClick={() => setPage(Page.UploadCompressed)}
          >
            Upload <Code mx={8}>.compressed</Code> file
          </Button>
        </Group>
      </Card>
    </Grid.Col>
  </Grid>
}

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },
  section: {
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
}));

export default Home;
