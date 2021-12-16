<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Blank</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Blank</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-card>
        <IonCardContent>
          <ion-button type="button" @click="count++"
            >count is: {{ count }}</ion-button
          >

          <ion-button type="button" @click="count = 0">reset</ion-button>
        </IonCardContent>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonCard,
  IonCardContent,
} from '@ionic/vue'
import { storeToRefs } from 'pinia'
import { useCounterStore } from '../stores/counter'

const { currentValue: count } = storeToRefs(useCounterStore())
</script>

<style></style>
