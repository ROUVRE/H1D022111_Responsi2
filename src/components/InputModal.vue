<template>
  <ion-modal :is-open="isOpen" @did-dismiss="cancel">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ editingId ? "Edit" : "Add" }} Menu</ion-title>
        <ion-buttons slot="start">
          <ion-button @click="cancel"
            ><ion-icon :icon="close"></ion-icon
          ></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-item>
        <ion-input
          v-model="localMenu.nama"
          label="Nama"
          label-placement="floating"
          placeholder="Masukkan Nama Menu"
        ></ion-input>
      </ion-item>
      <ion-item>
        <ion-textarea
          v-model="localMenu.resep"
          label="Resep"
          label-placement="floating"
          placeholder="Masukkan Resep"
          :autogrow="true"
          :rows="3"
        ></ion-textarea>
      </ion-item>
      <ion-row>
        <ion-col>
          <ion-button
            type="button"
            @click="input"
            shape="round"
            color="primary"
            expand="block"
          >
            {{ editingId ? "Edit" : "Add" }} Menu
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonInput,
  IonRow,
  IonCol,
  IonItem,
  IonContent,
  IonTextarea,
} from "@ionic/vue";
import { close } from "ionicons/icons";
import { Menu } from "@/utils/firestore";

const props = defineProps<{
  isOpen: boolean;
  editingId: string | null;
  menu: Omit<Menu, "id" | "createdAt" | "updatedAt" | "status">;
}>();

const emit = defineEmits<{
  "update:isOpen": [value: boolean];
  "update:editingId": [value: string | null];
  submit: [item: Omit<Menu, "id" | "createdAt" | "updatedAt" | "status">];
}>();

// local menu
const localMenu = ref<Omit<Menu, "id" | "createdAt" | "updatedAt" | "status">>({
  nama: "",
  resep: "",
});

// update local menu dengan props
watch(
  () => props.menu,
  (newMenu) => {
    localMenu.value = { ...newMenu };
  },
  { immediate: true, deep: true }
);

const cancel = () => {
  emit("update:isOpen", false);
  emit("update:editingId", null);
  localMenu.value = {
    nama: "",
    resep: "",
  };
};

const input = () => {
  emit("submit", localMenu.value);
  cancel();
};
</script>
