import { Dropzone, DropzoneStatus } from "@mantine/dropzone";
import {
  Button,
  Code,
  Grid,
  Group,
  Image,
  MantineTheme,
  Text,
  useMantineTheme
} from "@mantine/core";
import { ComponentProps, useState } from "react";
import { Icon as TablerIcon, Photo, Upload, X } from "tabler-icons-react";
import { showNotification } from "@mantine/notifications";
import { Page } from "../App";
import API_URL from "../config";

function UploadCompressed({ setPage }: { setPage(page: Page): void }) {
  const theme = useMantineTheme();
  const [isUploading, setUploading] = useState(false);
  const [url, setUrl] = useState<string>();

  async function upload(files: File[]) {
    if (!files[0].name.endsWith('.compressed')) {
      showNotification({
        color: 'red',
        title: 'Invalid file type',
        message: 'File must be a .compressed image. Consider compress it first.'
      })
      return;
    }
    setUploading(true);
    try {
      const body = new FormData();
      body.append('compressed', files[0]);
      const res = await fetch(API_URL + '/decompress', {
        method: 'POST',
        body
      });
      const bmp = await res.blob();
      const url = URL.createObjectURL(bmp);
      setUrl(url);
    } catch (err) {
      showNotification({
        color: 'red',
        title: 'Default notification',
        message: 'Hey there, your code is awesome! 🤥',
      })
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      {!url && <div>
          <Dropzone
              onDrop={upload}
              loading={isUploading}
              maxSize={10 * 1024 ** 2}
              mb={24}
          >
            {(status) => dropzoneChildren(status, theme)}
          </Dropzone>
          <Text
              underline
              onClick={() => setPage(Page.UploadBmp)}
              style={{ color: 'white', cursor: 'pointer' }}
          >
              Don't have <Code>.compressed</Code> file?
              Compress it first!
          </Text>
      </div>}
      {url && <div>
          <Text align="center" color="white">Decompressed image</Text>
          <Image height="50vh" fit="contain" src={url} alt="" />
          <Grid justify="center" my={16}>
              <Grid.Col span={8}>
                  <Button fullWidth onClick={() => {
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'decompressed.bmp';
                    a.click();
                  }}>Download</Button>
              </Grid.Col>
          </Grid>
      </div>}
    </>
  )
}

function getIconColor(status: DropzoneStatus, theme: MantineTheme) {
  return status.accepted
    ? theme.colors[theme.primaryColor][4]
    : status.rejected
      ? theme.colors.red[4]
      : theme.colors.dark[0];
}

function ImageUploadIcon({ status, ...props }: ComponentProps<TablerIcon>
  & { status: DropzoneStatus }) {
  if (status.accepted) return <Upload {...props} />;
  if (status.rejected) return <X {...props} />;
  return <Photo {...props} />;
}

const dropzoneChildren = (status: DropzoneStatus, theme: MantineTheme) => (
  <Group
    position="center"
    spacing="xl"
    style={{ minHeight: 220, pointerEvents: 'none' }}
  >
    <ImageUploadIcon
      status={status}
      style={{ color: getIconColor(status, theme) }}
      size={80}
    />
    <div>
      <Text size="xl" color="white">
        Drag your compressed file here
      </Text>
      <Text size="sm" color="dimmed" inline mt={7}>
        File must be <Code>.compressed</Code> format.
      </Text>
    </div>
  </Group>
);

export default UploadCompressed;
