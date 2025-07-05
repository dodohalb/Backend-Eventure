import { DeviceTokenDto } from "src/auth/deviceTokenDto";
import { Inject, Injectable, Logger } from '@nestjs/common';
import { In } from "typeorm";
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getMessaging, Messaging, MulticastMessage }    from 'firebase-admin/messaging';
import { DAO } from "src/repository/dao";
import { FIREBASE_MESSAGING } from "src/routing/firebase.provider";
import { DeviceTokenRepo } from "src/repository/deviceToken.repo";

@Injectable()
export class PushService {
    private readonly logger = new Logger(PushService.name);
    constructor( 
        @Inject(DeviceTokenRepo) private readonly deviceTokenRepo: DAO<DeviceTokenDto> ,
        @Inject(FIREBASE_MESSAGING) private readonly messaging: Messaging, // Inject Firebase Messaging
      ) {  }
    


    async notifyOffline(userIds: number[]): Promise<void> {
        // 1) Alle Device-Tokens holen
        const deviceTokenDtos = await this.deviceTokenRepo.findMany({ userId: In(userIds) } );
            this.logger.log(`Sending push notifications to offline users: ${userIds.join(', ')}`);
    
        if(deviceTokenDtos.length === 0) {
            this.logger.warn('No device tokens found for offline users');
            return;
        }
       // 2) Token-Liste extrahieren
        const tokens = deviceTokenDtos.map(dto => dto.token);
        this.logger.log(`Sending notifications to ${tokens.length} devices one by one.`);
       
        // 3) Message-Objekt für jedes token bauen und abschicken
        for (const token of tokens) { 
            try {
            await this.messaging.send( {
                    token,
                    data:    { type: 'sync' },
                    android: { priority: 'normal' },
                    apns:    { payload: { aps: { 'content-available': 1 } } },
                });
                this.logger.log(`Sent sync to ${token}`);
            } catch (err) {
                this.logger.error(`Error sending to ${token}:`, err);
            }

        }
    }

  
    
      /** Fügt neuen Token ein oder updated ihn, wenn er schon existiert */
    async upsertToken(deviceTokenDto: DeviceTokenDto): Promise<void> {
        // 1) Zuerst prüfen, ob genau dieser token schon vorhanden ist
        const existing = await this.deviceTokenRepo.findOne({ token: deviceTokenDto.token });
        if (existing) {
            // 2a) Wenn ja, ID übernehmen und updaten   
            deviceTokenDto.id = existing.id;
            await this.deviceTokenRepo.update(deviceTokenDto);
            this.logger.log(`Updated device-token id=${deviceTokenDto.id} for user ${deviceTokenDto.userId}`);
         }else {
            // 2b) Wenn nein, neu anlegen
            await this.deviceTokenRepo.insert(deviceTokenDto);
            this.logger.log(`Inserted new device-token for user ${deviceTokenDto.userId}`);
        }
    }

}