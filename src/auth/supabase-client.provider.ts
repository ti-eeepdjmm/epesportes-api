// auth/supabase-client.provider.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

export const SUPABASE_CLIENT = 'SUPABASE_CLIENT';

export const supabaseClientProvider = {
  provide: SUPABASE_CLIENT,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): SupabaseClient => {
    const supabaseUrl = configService.get<string>('SUPABASE_URL') as string;
    const supabaseKey = configService.get<string>(
      'SUPABASE_SERVICE_ROLE_KEY',
    ) as string;
    return createClient(supabaseUrl, supabaseKey);
  },
};
