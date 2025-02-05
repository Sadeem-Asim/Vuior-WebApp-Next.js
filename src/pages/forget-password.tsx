
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Input } from '@nextui-org/input'
import { Button } from '@nextui-org/button'
import { useState } from 'react'
import { useToast } from '../hooks/use-toast'
import { useAuth } from '../hooks/useAuth'
import { ResetPasswordSchema } from '../lib/validations'
import {
  FormField,
  Form,
  FormItem,
  FormControl,
  FormMessage
} from '../components/ui/form'

type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>

const ForgetPassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { user, sendResetPasswordEmail } = useAuth()
  const { toast } = useToast()

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: user?.email || ''
    }
  })

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = form

  const handleReset = (values: ResetPasswordFormData) => {
    setIsLoading(true)
   
    try {
      sendResetPasswordEmail(values.email) // Ensure async handling
      toast({
        title: 'Email Sent',
        description: 'Check your email to reset your password'
      })
    } catch (error) {
      console.error('Error sending reset email:', error)
      toast({
        title: 'Error',
        description: 'Unable to send email right now',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false) // Ensure loading state resets
    }
  }

  return (
    <div className='w-full flex flex-col items-center justify-center'>
      <div className='mb-5 w-full'>
        <h2 className='md:text-3xl text-5xl md:mb-2 font-semibold mb-5'>
          Password Recovery
        </h2>
        <p className='text-secondary-text mb-5 text-sm'>
          Please enter the email you used to create a Vuior account, and we'll
          send you a reset link.
        </p>
      </div>

      <Form {...form}>
        <form
          className='flex w-full flex-col gap-8 lg:gap-5'
          onSubmit={ 
    handleSubmit(handleReset)
  }
          // {handleSubmit(handleReset)}
        >
          <FormField
            control={control}
            name='email'
            render={({ field }) => (
              <FormItem className='relative items-center lg:gap-3'>
                <FormControl>
                  <Input
                    variant='bordered'
                    size='md'
                    type='text'
                    label='Email'
                    isInvalid={!!errors.email?.message}
                    {...field}
                  />
                </FormControl>
                <FormMessage>{errors.email?.message}</FormMessage>
              </FormItem>
            )}
          />

          <div className='flex items-center justify-between mt-10'>
            <Button
              radius='sm'
              className='text-white font-bold hover:bg-button-gpt-hover bg-button-gpt'
              isLoading={isLoading}
              variant='faded'
              type='submit'
            >
              Send Email
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default ForgetPassword
