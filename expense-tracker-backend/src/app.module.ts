import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ExpensesModule } from './expenses/expenses.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'postgres',

        host: configService.get('DB_HOST'),

        port: parseInt(configService.get('DB_PORT') || '5432'),

        username: configService.get('DB_USERNAME'),

        password: configService.get('DB_PASSWORD'),

        database: configService.get('DB_DATABASE'),

        autoLoadEntities: true,

        synchronize: true,
      }),
    }),

    UsersModule,

    AuthModule,

    ExpensesModule,
  ],
})
export class AppModule {}