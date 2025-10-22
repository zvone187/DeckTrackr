import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';

interface EmailCaptureFormProps {
  deckName: string;
  onSubmit: (email: string) => void;
  isLoading: boolean;
}

interface FormData {
  email: string;
}

export function EmailCaptureForm({ deckName, onSubmit, isLoading }: EmailCaptureFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const handleFormSubmit = (data: FormData) => {
    console.log('Email submitted:', data.email);
    onSubmit(data.email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-secondary/20 to-background">
      <Card className="w-full max-w-md border-2 shadow-2xl bg-background">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">{deckName}</CardTitle>
          <CardDescription className="text-base">
            Please enter your email address to view this pitch deck
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="investor@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                disabled={isLoading}
                className="h-12"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'View Deck'}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Your email will only be shared with the deck owner for tracking purposes
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}