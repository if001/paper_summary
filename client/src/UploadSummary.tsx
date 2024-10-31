import React, { useState } from 'react';
import { Box, Button, Input, Text, VStack, Spinner } from '@chakra-ui/react';
import FileBase64 from 'react-file-base64';
import axios from 'axios';
const instance = axios.create({
  baseURL: 'http://127.0.0.1:5000/',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
  },
  responseType: 'json'
});

interface UploadSummaryProps {
  onSummaryReceived: (filename: string, summary: string) => void;
}

const UploadSummary: React.FC<UploadSummaryProps> = ({ onSummaryReceived }) => {
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState();

  const handleFileUpload = async (file: any) => {
    setLoading(true);
    setFileName(file.name);
    setSummary('');
    setError('')

    try {
      const response = await instance.post('/summary', {
        pdfData: file.base64,
      });
      const resultSummary = response.data.summary;
      setSummary(resultSummary);
      onSummaryReceived(file.name, resultSummary);
    } catch (error) {
      setError('要約の取得に失敗しました。')
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Box>
        <Text fontSize="lg" fontWeight="bold">
          PDFファイルをアップロード
        </Text>
        <FileBase64 multiple={false} onDone={handleFileUpload} />
      </Box>

      {loading && <Spinner color="blue.500" size="lg" />}
      {error}

      {summary && (
        <Box p={4} bg="gray.100" borderRadius="md">
          <Text fontSize="md" fontWeight="semibold" mb={2}>
            要約
          </Text>
          <Text fontSize="sm">{summary}</Text>
        </Box>
      )}
    </VStack>
  );
};

export default UploadSummary;