import { Dropzone, DropzoneStatus } from "@mantine/dropzone";
import {
  Button,
  Card,
  Grid,
  Group,
  Image,
  MantineTheme,
  NumberInput,
  Text,
  useMantineTheme
} from "@mantine/core";
import { ComponentProps, useEffect, useState } from "react";
import {
  Icon as TablerIcon,
  Loader,
  Photo,
  Upload,
  X
} from "tabler-icons-react";
import { showNotification } from "@mantine/notifications";
import { Page } from "../App";
import API_URL from "../config";

function UploadBmp({ setPage }: { setPage(page: Page): void }) {
  const theme = useMantineTheme();
  const [id, setId] = useState<string>();
  const [step, setStep] = useState(0);
  const [level, setLevel] = useState(2);
  const [ratio, setRatio] = useState(10);
  const [isUploading, setUploading] = useState(false);
  const [isLoadingImage, setLoadingImage] = useState(false);

  async function upload(files: File[]) {
    setUploading(true);
    try {
      const body = new FormData();
      body.append('image', files[0]);
      const res = await fetch(API_URL + '/upload', { method: 'POST', body });
      if (res.status !== 201) throw new Error('Upload failed');
      const parsed = await res.json();
      setId(parsed.id);
    } catch (err) {
      showNotification({
        color: 'red',
        title: 'Error occurred',
        message: 'There is an error occurred while processing your image, please try another image or open an issue on GitHub.'
      })
    } finally {
      setUploading(false);
    }
  }

  useEffect(() => {
    setLoadingImage(true);
  }, [level, step, ratio, id]);

  async function download() {
    try {
      const res = await fetch(API_URL + `/compressed?uid=${id}&level=${level}&step=${step}&ratio=${ratio}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = id + '.compressed';
      a.click();
    } catch (err) {
      showNotification({
        color: 'red',
        title: 'Download failed',
        message: 'There was an error downloading your image. Please open an issue on GitHub.',
      })
    }
  }

  return (
    <>
      {!id && <div>
          <Dropzone
              onDrop={upload}
              loading={isUploading}
              onReject={() => {
                showNotification({
                  color: 'red',
                  title: 'Upload failed',
                  message: 'File rejected, please upload a .bmp file which less than 10 MB',
                });
              }}
              maxSize={10 * 1024 ** 2}
              mb={24}
              accept={['image/bmp']}
          >
            {(status) => dropzoneChildren(status, theme)}
          </Dropzone>
          <a href={"/example.bmp"} download
             style={{ color: 'white', textAlign: 'center' }}>
              Don't have .bmp file? Download example from here !
          </a>
      </div>}
      {id && <div>
          <Grid mb={24}>
              <Grid.Col span={6}>
                  <NumberInput
                      value={level}
                      onChange={v => {
                        setLevel(v || 0);
                        setStep(0);
                      }}
                      max={5}
                      min={1}
                      defaultValue={2}
                      label="level"
                  />
              </Grid.Col>
              <Grid.Col span={6}>
                  <NumberInput
                      value={ratio}
                      onChange={v => setRatio(v || 0)}
                      min={0}
                      max={100}
                      parser={(value) => value?.replace(/\$\s?|(%*)/g, '')}
                      defaultValue={10}
                      formatter={(value) => `${value}%`}
                      label="Compression ratio"
                  />
              </Grid.Col>
          </Grid>
          <Grid justify="center" my={16}>
              <Grid.Col span={8}>
                  <Button fullWidth onClick={download}>
                      Download compressed file
                  </Button>
              </Grid.Col>
          </Grid>
          <Text
              color="white" align="center" style={{ cursor: 'pointer' }}
              onClick={() => setPage(Page.UploadCompressed)}
          >
              Decompress it &rarr;
          </Text>
          <Card mt={64}>
              <Text align="center" color="white" weight="bolder" mb={36}>
                  See how it being compressed
              </Text>
              <Image
                  onError={() => showNotification({
                    color: 'red',
                    title: 'Error occurred',
                    message: 'There is an issue during processing or loading your image, please open an issue on GitHub.',
                  })}
                  onLoad={() => setLoadingImage(false)}
                  placeholder={<Loader />}
                  height="50vh"
                  fit="contain"
                  src={API_URL + `/visualization?uid=${id}&step=${step}&level=${level}&ratio=${ratio}`}
                  alt="" />
              <Grid justify="space-between" mt={16}>
                  <Grid.Col span={4}>
                      <Button
                          fullWidth
                          disabled={step === 0 || isLoadingImage}
                          onClick={() => setStep(step - 1)}
                      >
                          Previous Step
                      </Button>
                  </Grid.Col>
                  <Grid.Col span={4}>
                      <Button
                          fullWidth
                          disabled={step >= level * 4 + 1 || isLoadingImage}
                          onClick={() => setStep(step + 1)}
                      >
                          Next Step
                      </Button>
                  </Grid.Col>
              </Grid>
          </Card>
      </div>}
    </>
  );
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
        Drag your origin image here
      </Text>
      <Text size="sm" color="dimmed" inline mt={7}>
        File must be .bmp format and size less than 10 MB.
      </Text>
    </div>
  </Group>
);

export default UploadBmp;
