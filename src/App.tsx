import UploadBmp from "./pages/UploadBmp";
import { useState } from "react";
import UploadCompressed from "./pages/UploadCompressed";
import { Container, Text } from "@mantine/core";
import Footer from "./components/Footer";
import Home from "./pages/Home";

export enum Page {
  UploadBmp,
  UploadCompressed
}

function App() {
  const [page, setPage] = useState<Page>();
  return (
    <div style={{ width: "100%", position: 'relative' }}>
      <Container size="sm" px="sm" mt={64}>
        <Text
          style={{ cursor: 'pointer' }}
          color="white" weight="bolder" size="xl" align="center" mb={32}
          onClick={() => setPage(undefined)}
        >
          Haar Wavelet Image Compression Visualization
        </Text>
        {page === undefined && <Home setPage={setPage} />}
        {page === Page.UploadBmp && <UploadBmp setPage={setPage} />}
        {page === Page.UploadCompressed &&
            <UploadCompressed setPage={setPage} />}
      </Container>
      <Footer />
    </div>
  );
}


export default App;
