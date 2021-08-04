import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

interface NewImageData {
  url: string;
  title: string;
  description: string;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const acceptedFormatsRegex =  /(?:([^:/?#]+):)?(?:([^/?#]*))?([^?#](?:jpg|jpeg|gif|png))(?:\?([^#]*))?(?:#(.*))?/g;


  const formValidations = {
    image: {
      require: 'Arquivo obrigatório',
      validate: {
        lessThan10MB: fileList => fileList[0].size < 10000000 || 'O arquivo deve ser menor que 10MB',
        // lessThan10MB: (fileList) => {
        //   if (fileList[0].size < 10000000){
        //     return console.log(fileList)

        //   } else {
        //     return  'O arquivo deve ser menor que 10MB'
        //   }
        // },
        acceptedFormats: fileList => acceptedFormatsRegex.test(fileList[0].type) || 'Somento são aceitos arquivos PNG, JPG e GIF'
      }
    },
    title: {
      require: 'Título obrigatório',
      minLenght: {
        value: 2,
        message: 'Mínimo de 2 caracteres'
      },
      maxLength: {
        value: 20,
        message: 'Máximo de 20 caracteres'
      }
    },
    description: {
      require: 'Descrição obrigatória',
      maxLength: {
        value: 65,
        message: 'Máximo de 65 caracteres'
      }
    },
  };


  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (image: NewImageData) => {
      await api.post('api/images', {
        ...image,
        url: imageUrl
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('images')
      }
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState,
    setError,
    trigger,
  } = useForm();
  const { errors } = formState;

  const onSubmit = async (data: NewImageData): Promise<void> => {
    try {
      if(!imageUrl){
        toast({
          status: 'error',
          title: 'Imagem não adicionada',
          description: 'É preciso adicionar e aguardar o upload da imagem antes de realizar o cadastro'
        });
        return
      }
      await mutation.mutateAsync(data);
      toast({
        status: 'success',
        title: 'Imagem Cadastrada',
        description: 'Imagem sua imagem foi cadastrada com sucesso'
      })
    } catch {
      toast({
        status: 'error',
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem'
      })
    } finally {
      reset();
      setImageUrl('');
      setLocalImageUrl('');
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          error={errors.image}
          {...register('image', formValidations.image)}
        />

        <TextInput
          placeholder="Título da imagem..."
          error={errors.title}

          {...register('title', formValidations.title)}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          error={errors.description}

          {...register('description', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
