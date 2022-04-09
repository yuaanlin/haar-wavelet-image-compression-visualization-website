import { Text } from "@mantine/core";

function Footer() {
  return <div style={{ width: '100%', margin: '64px 0' }}>
    <Text
      color="dimmed" weight="bolder" align="center"
      style={{ cursor: 'pointer' }}
      mt={32} underline onClick={() => {
      window.open('https://github.com/ken20001207/haar-wavelet-image-compression-visualization')
    }}>
      Made with ❤️ by Yuanlin Lin
    </Text>
  </div>;
}

export default Footer;
