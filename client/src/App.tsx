import React, { useState } from 'react';
import { Box, Flex, VStack, Text } from '@chakra-ui/react';
import UploadSummary from './UploadSummary';

interface SummaryHistory {
  id: number;
  filename: string;
  summary: string;
}

const App: React.FC = () => {
  const [history, setHistory] = useState<SummaryHistory[]>([]);

  const addToHistory = (filename: string, summary: string) => {
    setHistory((prevHistory) => [
      ...prevHistory,
      { id: Date.now(), filename, summary },
    ]);
  };

  return (
    <>
      <Flex h="100vh" p={4} bg="gray.50">
        <Box w="250px" p={4} bg="white" borderRadius="md" shadow="md">
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            履歴
          </Text>
          <VStack spacing={3} align="start">
            {history.map((item) => (
              <Box key={item.id} bg="gray.100" p={2} borderRadius="md" w="full">
                <Text fontSize="sm" fontWeight="semibold">
                  {item.filename}
                </Text>
                <Text fontSize="xs" color="gray.600" noOfLines={2}>
                  {item.summary}
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>
        <Box flex="1" ml={4} p={4} bg="white" borderRadius="md" shadow="md">
          <UploadSummary onSummaryReceived={addToHistory} />
        </Box>
      </Flex>
    </>
  );
};

export default App;
