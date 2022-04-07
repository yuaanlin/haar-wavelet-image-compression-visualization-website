import { Dropzone, DropzoneStatus } from "@mantine/dropzone";
import {
  Button,
  Container,
  Grid,
  Group,
  Image,
  MantineTheme,
  NumberInput,
  Text,
  useMantineTheme
} from '@mantine/core';
import {
  Icon as TablerIcon,
  Loader,
  Photo,
  Upload,
  X
} from 'tabler-icons-react';
import { ComponentProps, useEffect, useState } from "react";
import { showNotification } from "@mantine/notifications";

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

function App() {
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
      const res = await fetch('https://api.haar.linyuanlin.com/upload',
        { method: 'POST', body });
      const parsed = await res.json();
      showNotification({
        title: '上传成功',
        message: 'uid 为 ' + parsed.id,
      })
      setId(parsed.id);
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

  useEffect(() => {
    setLoadingImage(true);
  }, [level, step, ratio, id]);

  return (
    <div style={{ width: "100%", height: '100vh', position: 'relative' }}>
      <Container size="sm" px="sm" mt={64}>
        <Text color="white" weight="bolder" size="xl" align="center" mb={32}>
          Haar Wavelet Image Compression Visualization
        </Text>
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
                src={`https://api.haar.linyuanlin.com/visualization?uid=${id}&step=${step}&level=${level}&ratio=${ratio}`}
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
        </div>}
      </Container>
      <div style={{ position: 'absolute', bottom: 96, width: '100%' }}>
        <Text
          color="dimmed" weight="bolder" align="center"
          style={{ cursor: 'pointer' }}
          mt={32} underline onClick={() => {
          window.open('https://github.com/ken20001207/haar-wavelet-image-compression-visualization')
        }}>
          Made with ❤️ by Yuanlin Lin
        </Text>
      </div>
    </div>
  )
}

export default App
