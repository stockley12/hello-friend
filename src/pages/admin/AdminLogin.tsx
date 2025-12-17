import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export function AdminLogin() {
  const { authenticateAdmin, settings } = useSalon();
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authenticateAdmin(pin)) {
      navigate('/admin');
    } else {
      setError('Invalid PIN');
      setPin('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <Card className="card-premium">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h1 className="font-display text-2xl font-semibold">{settings.name}</h1>
              <p className="text-muted-foreground text-sm">Admin Access</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Enter PIN"
                  value={pin}
                  onChange={(e) => { setPin(e.target.value); setError(''); }}
                  className="h-12 text-center text-2xl tracking-widest"
                  maxLength={6}
                />
                {error && <p className="text-destructive text-sm mt-2 text-center">{error}</p>}
              </div>
              <Button type="submit" className="w-full h-12">Sign In</Button>
            </form>
            <p className="text-xs text-muted-foreground text-center mt-4">Default PIN: 1234</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
