<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar color="primary">
        <ion-title>Cuaca Jakarta</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <!-- Tombol untuk memicu event click -->
      <ion-button expand="block" @click="ambilDataCuaca" :disabled="loading">
        {{ loading ? 'Memuat Data...' : 'Ambil Data Cuaca' }}
      </ion-button>

      <!-- List untuk menampilkan data -->
      <ion-list v-if="weatherData.length > 0">
        <ion-list-header>
          <ion-label>Prakiraan Suhu (10 Data Pertama)</ion-label>
        </ion-list-header>

        <!-- v-for untuk melakukan looping data -->
        <ion-item v-for="(item, index) in weatherData" :key="index">
          <ion-label>
            <h2>{{ formatWaktu(item.time) }}</h2>
            <p>
              Suhu: <b>{{ item.temperature_2m }} °C</b>
            </p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
} from '@ionic/vue';
import { defineComponent } from 'vue';
// Menggunakan alias '@' untuk mengakses folder src
import EndPointAccess from '@/services/EndpointAccess/index';
import type { WeatherApiResponse } from '@/types/Weather';

export default defineComponent({
  name: 'HomePage',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
  },
  data() {
    return {
      weatherData: [] as { time: string; temperature_2m: number }[],
      loading: false,
    };
  },
  methods: {
    async ambilDataCuaca() {
      this.loading = true;
      const url = 'https://api.open-meteo.com/v1/forecast?latitude=-6.2&longitude=106.8&hourly=temperature_2m';

      try {
        // Memanfaatkan class EndPointAccess (Modul 8) & Axios (Modul 12)
        const resData = new EndPointAccess(url);
        const response = await resData.getRes();

        const apiData = response.data as WeatherApiResponse;

        // Instruksi tugas: Tampilkan 10 data pertama saja
        const times = apiData.hourly.time.slice(0, 10);
        const temps = apiData.hourly.temperature_2m.slice(0, 10);

        this.weatherData = times.map((time, index) => ({
          time: time,
          temperature_2m: temps[index],
        }));
      } catch (error) {
        console.error('Gagal mengambil data:', error);
        alert('Gagal mengambil data cuaca');
      } finally {
        this.loading = false;
      }
    },
    formatWaktu(waktuIso: string) {
      const date = new Date(waktuIso);
      return date.toLocaleString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
  },
});
</script>
