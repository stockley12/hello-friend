import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Loader2 } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export function AdminLogin() {
  const { authenticateAdmin, settings } = useSalon();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const isValid = await authenticateAdmin(pin);
      if (isValid) {
        // Force full page load so Safari updates URL bar
        window.location.href = '/admin/dashboard';
      } else {
        setError('Invalid PIN');
        setPin('');
        setIsLoading(false);
      }
    } catch {
      setError('Connection error - try again');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'hsl(40, 10%, 8%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <Card className="border border-primary/20" style={{ background: 'hsl(40, 10%, 10%)' }}>
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'hsl(48, 100%, 50%, 0.15)' }}>
                <Lock className="h-8 w-8" style={{ color: 'hsl(48, 100%, 50%)' }} />
              </div>
              <h1 className="font-display text-2xl font-semibold" style={{ color: 'hsl(45, 30%, 95%)' }}>{settings.name}</h1>
              <p className="text-sm" style={{ color: 'hsl(40, 15%, 60%)' }}>Admin Access</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Enter PIN"
                  value={pin}
                  onChange={(e) => { setPin(e.target.value); setError(''); }}
                  className="h-12 text-center text-2xl tracking-widest border-primary/30"
                  style={{ background: 'hsl(40, 10%, 12%)', color: 'hsl(45, 30%, 95%)' }}
                  maxLength={6}
                  disabled={isLoading}
                />
                {error && <p className="text-sm mt-2 text-center" style={{ color: 'hsl(0, 84%, 60%)' }}>{error}</p>}
              </div>
              <Button type="submit" className="w-full h-12 btn-premium" disabled={isLoading || !pin}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
            <p className="text-xs text-center mt-4" style={{ color: 'hsl(40, 15%, 60%)' }}>Enter your admin PIN</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
