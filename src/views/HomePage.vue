<style scoped>
ion-card,
ion-accordion-group {
  width: 100%;
}

ion-fab {
  margin: 25px;
}

.limited-text {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

ion-card-title.limited-text {
  -webkit-line-clamp: 1;
  line-clamp: 1;
}

ion-card-subtitle.limited-text {
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.scrollable-container {
  max-height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.accordion-container {
  --padding-start: 0;
  --inner-padding-end: 0;
}

ion-item {
  --padding-start: 0;
  --inner-padding-end: 0;
}

.scrollable-container::-webkit-scrollbar {
  width: 8px;
}

.scrollable-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.scrollable-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.scrollable-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Daftar Menu</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-refresher
        slot="fixed"
        :pull-factor="0.5"
        :pull-min="100"
        :pull-max="200"
        @ionRefresh="handleRefresh($event)"
      >
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- active menus -->
      <div class="scrollable-container">
        <ion-list>
          <ion-item-sliding
            v-for="menu in activeMenus"
            :key="menu.id"
            :ref="(el) => setItemRef(el, menu.id!)"
          >
            <ion-item-options side="start" @ionSwipe="handleDelete(menu)">
              <ion-item-option
                color="danger"
                expandable
                @click="handleDelete(menu)"
              >
                <ion-icon
                  slot="icon-only"
                  :icon="trash"
                  size="large"
                ></ion-icon>
              </ion-item-option>
            </ion-item-options>

            <ion-item>
              <ion-card>
                <ion-card-header>
                  <ion-card-title class="ion-text-wrap limited-text">{{
                    menu.nama
                  }}</ion-card-title>
                  <ion-card-subtitle class="limited-text">{{
                    menu.resep
                  }}</ion-card-subtitle>
                </ion-card-header>

                <ion-card-content>
                  <ion-badge>{{ getRelativeTime(menu.updatedAt) }}</ion-badge>
                </ion-card-content>
              </ion-card>
            </ion-item>

            <ion-item-options side="end" @ionSwipe="handleStatus(menu)">
              <ion-item-option @click="handleEdit(menu)">
                <ion-icon
                  slot="icon-only"
                  :icon="create"
                  size="large"
                ></ion-icon>
              </ion-item-option>
              <ion-item-option
                color="success"
                expandable
                @click="handleStatus(menu)"
              >
                <ion-icon
                  slot="icon-only"
                  :icon="checkmarkCircle"
                  color="light"
                  size="large"
                ></ion-icon>
              </ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
          <ion-item v-if="activeMenus.length === 0" class="ion-text-center">
            <ion-label
              >Menu masih kosong, silahkan tambah menu dan resep</ion-label
            >
          </ion-item>
        </ion-list>
      </div>

      <!-- completed menus -->
      <!-- <ion-item class="accordion-container">
        <ion-accordion-group>
          <ion-accordion value="first">
            <ion-item slot="header" color="light">
              <ion-label class="ion-text-center">Completed</ion-label>
            </ion-item>
            <div slot="content" class="scrollable-container">
              <ion-list>
                <ion-item-sliding
                  v-for="menu in completedMenus"
                  :key="menu.id"
                  :ref="(el) => setItemRef(el, menu.id!)"
                >
                  <ion-item-options side="start" @ionSwipe="handleDelete(menu)">
                    <ion-item-option
                      color="danger"
                      expandable
                      @click="handleDelete(menu)"
                    >
                      <ion-icon
                        slot="icon-only"
                        :icon="trash"
                        size="large"
                      ></ion-icon>
                    </ion-item-option>
                  </ion-item-options>

                  <ion-item>
                    <ion-card>
                      <ion-card-header>
                        <ion-card-title class="ion-text-wrap limited-text">{{
                          menu.title
                        }}</ion-card-title>
                        <ion-card-subtitle class="limited-text">{{
                          menu.description
                        }}</ion-card-subtitle>
                      </ion-card-header>

                      <ion-card-content>
                        <ion-badge>{{
                          getRelativeTime(menu.updatedAt)
                        }}</ion-badge>
                      </ion-card-content>
                    </ion-card>
                  </ion-item>

                  <ion-item-options side="end" @ionSwipe="handleStatus(menu)">
                    <ion-item-option @click="handleEdit(menu)">
                      <ion-icon
                        slot="icon-only"
                        :icon="create"
                        size="large"
                      ></ion-icon>
                    </ion-item-option>
                    <ion-item-option
                      color="warning"
                      expandable
                      @click="handleStatus(menu)"
                    >
                      <ion-icon
                        slot="icon-only"
                        :icon="close"
                        color="light"
                        size="large"
                      ></ion-icon>
                    </ion-item-option>
                  </ion-item-options>
                </ion-item-sliding>
                <ion-item
                  v-if="completedMenus.length === 0"
                  class="ion-text-center"
                >
                  <ion-label>No completed menus</ion-label>
                </ion-item>
              </ion-list>
            </div>
          </ion-accordion>
        </ion-accordion-group>
      </ion-item> -->

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="isOpen = true">
          <ion-icon :icon="add" size="large"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <InputModal
        v-model:isOpen="isOpen"
        v-model:editingId="editingId"
        :menu="menu"
        @submit="handleSubmit"
      />
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
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge,
  IonIcon,
  IonFab,
  IonFabButton,
  IonAccordion,
  IonAccordionGroup,
  IonLabel,
  IonList,
  loadingController,
  IonRefresher,
  IonRefresherContent,
  toastController,
} from "@ionic/vue";
import {
  add,
  checkmarkCircle,
  close,
  create,
  trash,
  closeCircle,
  warningOutline,
} from "ionicons/icons";
import InputModal from "../components/InputModal.vue";
import { onMounted, ref, computed, onUnmounted } from "vue";
import { firestoreService, type Menu } from "@/utils/firestore";
import { formatDistanceToNow } from "date-fns";

const isOpen = ref(false);
const editingId = ref<string | null>(null);
const menus = ref<Menu[]>([]);
const menu = ref<Omit<Menu, "id" | "createdAt" | "updatedAt" | "status">>({
  nama: "",
  resep: "",
});
const activeMenus = computed(() => menus.value.filter((menu) => !menu.status));
const completedMenus = computed(() =>
  menus.value.filter((menu) => menu.status)
);
const itemRefs = ref<Map<string, HTMLIonItemSlidingElement>>(new Map());
let intervalId: any;
const timeUpdateTrigger = ref(0);

// mendapatkan value dari item
const setItemRef = (el: any, id: string) => {
  if (el) {
    itemRefs.value.set(id, el.$el);
  }
};

// toast notifikasi
const showToast = async (
  message: string,
  color: string = "success",
  icon: string = checkmarkCircle
) => {
  const toast = await toastController.create({
    message,
    duration: 2000,
    color,
    position: "top",
    icon,
  });
  await toast.present();
};

// mendapatkan perbedaan waktu
const getRelativeTime = (date: any) => {
  timeUpdateTrigger.value;
  try {
    const jsDate = date?.toDate ? date.toDate() : new Date(date);
    return formatDistanceToNow(jsDate, { addSuffix: true });
  } catch (error) {
    return "Invalid date";
  }
};

// handle swipe refresher
const handleRefresh = async (event: any) => {
  try {
    await loadMenus(false);
  } catch (error) {
    console.error("Error refreshing:", error);
  } finally {
    event.target.complete();
  }
};

// handle submit add/edit pada modal
const handleSubmit = async (
  menu: Omit<Menu, "id" | "createdAt" | "updatedAt" | "status">
) => {
  if (!menu.nama) {
    await showToast("Tolong masukkan nama menu", "warning", warningOutline);
    return;
  }
  try {
    if (editingId.value) {
      await firestoreService.updateMenu(editingId.value, menu as Menu);
      await showToast("Menu updated successfully", "success", checkmarkCircle);
    } else {
      await firestoreService.addMenu(menu as Menu);
      await showToast("Menu added successfully", "success", checkmarkCircle);
    }
    loadMenus();
  } catch (error) {
    await showToast("An error occurred", "danger", closeCircle);
    console.error(error);
  } finally {
    editingId.value = null;
  }
};

// load data
const loadMenus = async (isLoading = true) => {
  let loading;
  if (isLoading) {
    loading = await loadingController.create({
      message: "Loading...",
    });
    await loading.present();
  }

  try {
    menus.value = await firestoreService.getMenus();
  } catch (error) {
    console.error(error);
  } finally {
    if (loading) {
      await loading.dismiss();
    }
  }
};

// dijalankan setiap halaman diload, load data dan set interval update 1 menit
onMounted(() => {
  loadMenus();
  intervalId = setInterval(() => {
    timeUpdateTrigger.value++;
  }, 60000);
});

// reset interval update
onUnmounted(() => {
  clearInterval(intervalId);
});

// handle edit click
const handleEdit = async (editMenu: Menu) => {
  const slidingItem = itemRefs.value.get(editMenu.id!);
  await slidingItem?.close();

  editingId.value = editMenu.id!;
  menu.value = {
    nama: editMenu.nama,
    resep: editMenu.resep,
  };
  isOpen.value = true;
};

// handle delete click/swipe
const handleDelete = async (deleteMenu: Menu) => {
  try {
    await firestoreService.deleteMenu(deleteMenu.id!);
    await showToast("Menu deleted successfully", "success", checkmarkCircle);
    loadMenus();
  } catch (error) {
    await showToast("Failed to delete menu", "danger", closeCircle);
    console.error(error);
  }
};

// handle status click/swipe, mengubah status menu active (false)/completed (true)
const handleStatus = async (statusMenu: Menu) => {
  const slidingItem = itemRefs.value.get(statusMenu.id!);
  await slidingItem?.close();
  try {
    await firestoreService.updateStatus(statusMenu.id!, !statusMenu.status);
    await showToast(
      `Menu marked as ${!statusMenu.status ? "completed" : "active"}`,
      "success",
      checkmarkCircle
    );
    loadMenus();
  } catch (error) {
    await showToast("Failed to update status", "danger", closeCircle);
    console.error(error);
  }
};
</script>
