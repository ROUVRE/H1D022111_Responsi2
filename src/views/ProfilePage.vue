<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Profile</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <!-- Avatar -->
      <div id="avatar-container">
        <ion-avatar>
          <img
            alt="Avatar"
            v-if="user?.photoURL"
            :src="userPhoto"
            @error="handleImageError"
          />
        </ion-avatar>
      </div>

      <!-- Data Profile -->
      <ion-list>
        <ion-item>
          <ion-input
            label="Nama"
            :value="user?.displayName"
            :readonly="true"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-input
            label="Email"
            :value="user?.email"
            :readonly="true"
          ></ion-input>
        </ion-item>
      </ion-list>

      <!-- Logout Button -->
      <div id="logout-container">
        <ion-button
          fill="solid"
          @click="logout"
          style="--background: red; color: white"
        >
          <ion-icon slot="start" :icon="exit"></ion-icon>
          Logout
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonItem,
  IonList,
  IonButton,
  IonAvatar,
  IonIcon,
} from "@ionic/vue";
import { exit } from "ionicons/icons";
import { computed, ref } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const logout = () => {
  authStore.logout();
};

const userPhoto = ref(
  user.value?.photoURL || "https://ionicframework.com/docs/img/demos/avatar.svg"
);

function handleImageError() {
  userPhoto.value = "https://ionicframework.com/docs/img/demos/avatar.svg";
}
</script>

<style scoped>
#avatar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

#logout-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

ion-button {
  width: 200px;
  text-align: center;
}
</style>
