import { Button, Heading, Flex } from '@chakra-ui/react';

type ErrorProps = {
  onReload: () => void;
}

export function Error({onReload}: ErrorProps): JSX.Element {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      h="100vh"
      flexDir="column"
    >
      <Heading>Infelizmente ocorreu um erro =(</Heading>
      <Button py={6} onClick={onReload} mt={4}>
        Clique aqui para tentar novamente
      </Button>
    </Flex>
  );
}
