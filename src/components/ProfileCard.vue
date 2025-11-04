<template>
  <div>
    <div
      v-if="viewType === 'grid'"
      class="relative group bg-linear-to-b from-[#f5f5f5] to-gray-300 dark:bg-linear-to-b dark:from-[#1f2937] dark:to-[#111827] w-full h-100 rounded-2xl overflow-hidden shadow-xl transition-all duration-200"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <img
        :src="profile.profileImage"
        alt="Profile photo"
        class="absolute w-full h-[60%] object-contain"
      />

      <svg
        class="absolute bottom-0 left-0 w-full z-10 transition-all duration-500"
        viewBox="0 0 1440 350"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          class="transition-all duration-500"
          :class="{
            'fill-accent-color': isHovered,
            'fill-white dark:fill-(--surface)': !isHovered,
          }"
          d="
          M0,200
          C240,220,480,180,720,200
          C960,220,1200,180,1440,200
          V350H0Z
        "
        />
      </svg>

      <div
        class="h-15 w-15 rounded-full absolute z-20 top-1/2 right-10 rtl:right-auto rtl:left-10 border border-white flex items-center justify-center transition-all duration-500"
        :class="isHovered ? 'bg-dark-blue' : 'bg-accent-color'"
      >
        <img src="../images/plumberIcon.png" alt="" class="transition-all duration-500 p-2" />
      </div>

      <div
        class="absolute bottom-0 w-full px-4 py-3 z-20 flex flex-col items-center text-center text-(--text-primary)"
      >
        <h2
          class="text-2xl font-bold transition-colors duration-500"
          :class="isHovered ? 'text-white' : 'text-(--text-primary)'"
        >
          {{ profile.name }}
        </h2>

        <div class="text-m pt-4" :class="isHovered ? 'text-(--text-primary)' : 'text-accent-color'">
          {{ $t("profilesPage.ordersCompleted") }}
          <span class="font-semibold">{{ ordersCompleted > 0 ? "+" + ordersCompleted : 0 }}</span>
        </div>

        <div class="flex items-center gap-1">
          <span class="text-sm font-bold" :class="isHovered ? 'text-white' : 'text-(--text-primary)'">
            {{ profile.rating.toFixed() }}
          </span>
          <i class="fa-solid fa-star text-[#FF9529]"></i>
        </div>
        <div class="flex flex-row items-center gap-10">
          <button
            class="mt-4 text-white text-sm font-medium px-5 py-2 rounded-lg shadow transition-all duration-500"
            :class="isHovered ? 'bg-[#0B161B]' : 'bg-[#5984C6]'"
          >
            <router-link :to="`/profile/${profile.id}`" class="">
              {{ $t("profilesPage.viewProfile") }}
            </router-link>
          </button>

          <div class="flex items-center gap-1 mt-2">
            <i
              class="fa-solid fa-location-dot"
            :class="isHovered ? 'text-white' : 'text-(--text-primary)'"
            ></i>
            <span class="text-sm" :class="isHovered ? 'text-white' : 'text-(--text-primary)'">
              {{ profile.location }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      class="flex flex-col sm:flex-row items-start bg-(--surface) rounded-2xl overflow-hidden shadow-xl p-4 gap-4 sm:gap-6 hover:shadow-2xl transition-shadow duration-200"
    >
      <img
        src="../images/lamp-big-3.jpg"
        alt="Profile photo"
        class="w-full sm:w-32 sm:h-32 md:w-50 md:h-50 object-cover rounded-xl"
      />
      <div class="flex flex-col flex-1 mt-4 sm:mt-0 text-left rtl:text-right">
        <div>
          <h2 class="text-lg md:text-xl font-bold text-(--text-primary)">{{ profile.name }}</h2>
          <div class="flex items-center gap-2 text-sm text-(--text-muted)">
            <span class="font-medium text-accent-color">{{ profile.service }}</span>
          </div>
        </div>
        <p class="text-sm md:text-base text-(--text-muted) mt-2">
          {{ profile.bio }}
        </p>

        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 md:mt-20 gap-4"
        >
          <div class="flex items-center gap-6 text-sm text-(--text-primary) space-x-6 rtl:space-x-reverse">
            <div class="flex items-center gap-1">
              <i class="fa-solid fa-star text-[#FF9529]"></i>
              <span class="font-bold">{{ profile.rating }}</span>
            </div>

            <div class="flex items-center gap-1">
              <i class="fa-solid fa-location-dot text-accent-color"></i>
              <span class="dark:text-accent-color">{{ profile.location }}</span>
            </div>
          </div>
          <button
            class="w-full sm:w-auto mx-auto sm:mx-0 text-white text-sm font-medium px-5 py-2 rounded-lg transition duration-300 bg-accent-color hover:bg-dark-blue"
          >
            {{ $t("profilesPage.viewProfile") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, db } from "@/firebase/firebase";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";

export default {
  name: "ProfileCard",
  data() {
    return {
      isHovered: false,
      memberSince: "",
      ordersCompleted: 0,
      ordersUnsub: null,
    };
  },
  props: {
    profile: Object,
    viewType: {
      type: String,
      default: "grid",
    },
  },
  async mounted() {
    try {
      const profileId = this.profile?.id;

      if (profileId) {
        try {
          const userRef = doc(db, "technicians", profileId); 
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            if (data.createdAt?.seconds) {
              const date = new Date(data.createdAt.seconds * 1000);
              this.memberSince = date.getFullYear();
            } else if (data.createdAt) {
              const d = new Date(data.createdAt);
              this.memberSince = isNaN(d.getTime())
                ? this.$t("profilesPage.fallbackNA")
                : d.getFullYear();
            } else {
              this.memberSince = this.$t("profilesPage.fallbackNA");
            }
          }
        } catch (e) {
          console.error("Error fetching profile createdAt:", e);
        }
      }

      try {
        const pid = profileId || auth.currentUser?.uid;
        if (pid) {
          const ordersRef = collection(db, "orders");
          const q = query(
            ordersRef,
            where("technicianId", "==", pid),
            where("status", "==", "completed")
          );
          this.ordersUnsub = onSnapshot(q, (snap) => {
            this.ordersCompleted = snap.size;
          });
        }
      } catch (e) {
        console.error("ProfileCard orders listener error:", e);
      }
    } catch (e) {
      console.error("ProfileCard mounted error:", e);
    }
  },
  beforeUnmount() {
    if (this.ordersUnsub) this.ordersUnsub();
  },
};
</script>

<style scoped>
svg {
  height: 100%;
}
</style>
