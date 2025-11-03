<template>
  <div class="pb-16">
    <div class="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 mt-10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        <div
          class="relative lg:col-span-2 w-full mx-auto bg-accent-color rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition duration-300"
        >
          <div
            class="absolute top-4 right-4 rtl:right-auto rtl:left-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm"
          >
            {{ $t('offersPage.banner1.tag') }}
          </div>
          <h1 class="text-3xl md:text-4xl font-bold mb-4">{{ $t('offersPage.banner1.title') }}</h1>
          <div
            class="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30 inline-block"
          >
            <div class="text-4xl md:text-5xl font-black mb-2">150 EGP</div>
            <div class="text-2xl font-semibold">{{ $t('offersPage.banner1.subtitle') }}</div>
          </div>
          <p class="mt-6 text-lg">{{ $t('offersPage.banner1.text') }}</p>
          <router-link
            to="/signup"
            class="mt-6 bg-white text-accent-color w-fit px-8 py-3 rounded-full font-semibold hover:shadow-xl transition transform hover:scale-105 flex items-center space-x-2 rtl:space-x-reverse"
          >
            <span>{{ $t('offersPage.banner1.button') }}</span>
          </router-link>
        </div>

        <div
          class="bg-gradient-to-br w-full mx-auto from-purple-600 to-pink-500 rounded-2xl p-8 text-white shadow-2xl hover:scale-105 transition duration-300"
        >
          <div class="flex flex-col items-center justify-between gap-6">
            <div class="flex-1 text-center">
              <h2 class="text-2xl md:text-3xl font-bold mb-2">{{ $t('offersPage.banner2.title') }}</h2>
              <p class="text-lg opacity-90">
                {{ $t('offersPage.banner2.text') }}
              </p>
            </div>

            <div
              class="bg-white/10 backdrop-blur-md rounded-2xl px-8 py-6 border-2 border-white/30"
            >
              <div class="text-3xl md:text-4xl font-black">100 EGP</div>
              <div class="text-sm font-semibold mt-1">{{ $t('offersPage.banner2.subtitle') }}</div>
            </div>

            <button
              class="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:shadow-xl transition transform hover:scale-105 flex items-center space-x-2 rtl:space-x-reverse whitespace-nowrap"
            >
              <span>{{ $t('offersPage.banner2.button') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
      
      <div v-if="isLoading" class="text-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-accent-color mx-auto"></div>
        <p class="mt-3 text-(--text-muted)">{{ $t('offersPage.grid.loading') }}</p>
      </div>

      <div v-else-if="offers.length === 0" class="text-center py-20">
        <i class="fa-solid fa-tags text-4xl text-(--text-muted) mb-4"></i>
        <h3 class="text-xl font-semibold text-(--text-primary)">{{ $t('offersPage.grid.emptyTitle') }}</h3>
        <p class="text-(--text-muted) mt-2">{{ $t('offersPage.grid.emptyText') }}</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
        <div
          v-for="offer in offers"
          :key="offer.id" 
          class="relative bg-(--surface) rounded-2xl w-full max-w-xs sm:max-w-none shadow-md hover:shadow-xl transition transform hover:scale-105"
        >
          <div class="absolute top-0 left-0 rtl:left-auto rtl:right-0">
            <img
              src="../images/offerdisc.png"
              class="w-15"
              alt=""
            />
          </div>

          <img
            :src="offer.image"
            alt="offer image"
            class="w-full rounded-t-2xl h-70 object-cover"
          />

          <div class="card-body mt-2 items-center text-center p-3">
            <h2 class="text-(--accent) font-bold text-xl">{{ offer.title }} {{ $t('offersPage.grid.suffix') }}</h2>
            <p class="text-(--text-muted) text-sm">{{ offer.description }}</p>
            <div class="mt-4">
              <button
                @click="claimOffer(offer)"
                :disabled="isClaiming === offer.id || claimedOfferIds.has(offer.id)"
                class="text-white font-semibold py-2 transition rounded-[10px] px-3 text-lg"
                :class="[
                  { 'bg-green-600 hover:bg-green-700 cursor-default': claimedOfferIds.has(offer.id) },
                  { 'bg-accent-color hover:bg-(--accent)': !claimedOfferIds.has(offer.id) },
                  { 'opacity-50 cursor-not-allowed': isClaiming === offer.id }
                ]"
              >
                {{ 
                  isClaiming === offer.id 
                    ? $t('offersPage.grid.buttonClaiming') 
                    : (claimedOfferIds.has(offer.id) ? $t('offersPage.grid.buttonClaimed') : $t('offersPage.grid.buttonClaim')) 
                }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { db } from '@/firebase/firebase'; // Adjust this path based on your project structure
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

// --- Reactive State ---
const offers = ref([]);
const isLoading = ref(true);
const userId = ref(null);
const claimedOfferIds = ref(new Set());
const isClaiming = ref(null); // Stores the ID of the offer being claimed

// --- Composables ---
const router = useRouter();
const auth = getAuth();

/**
 * Fetches all available offers from the main 'offers' collection.
 */
const fetchOffers = async () => {
  try {
    const offersCollection = collection(db, 'offers');
    const querySnapshot = await getDocs(offersCollection);

    const fetchedOffers = [];
    querySnapshot.forEach((doc) => {
      fetchedOffers.push({ 
        id: doc.id, 
        ...doc.data() 
      });
    });
    
    offers.value = fetchedOffers;
    
  } catch (error) {
    console.error("Error fetching offers: ", error);
  } finally {
    isLoading.value = false;
  }
};

/**
 * Fetches the IDs of offers the current user has already claimed.
 */
const fetchClaimedOffers = async (uid) => {
  if (!uid) {
    claimedOfferIds.value = new Set();
    return;
  }
  try {
    const claimedOffersCol = collection(db, 'clients', uid, 'claimedOffers');
    const snapshot = await getDocs(claimedOffersCol);
    const ids = new Set();
    snapshot.forEach(doc => ids.add(doc.id));
    claimedOfferIds.value = ids;
  } catch (error) {
    console.error("Error fetching claimed offers: ", error);
  }
};

/**
 * Handles the "Claim Offer" button click.
 * If not logged in, redirects to /login.
 * If logged in, saves the offer to the user's profile.
 */
const claimOffer = async (offer) => {
  const user = auth.currentUser;

  // 1. Check if logged in
  if (!user) {
    router.push('/login');
    return;
  }

  // 2. Check if already claimed
  if (claimedOfferIds.value.has(offer.id)) {
    return; // Already claimed, do nothing
  }

  isClaiming.value = offer.id; // Set loading state for this specific button

  try {
    // 3. Save offer to user's subcollection
    const offerRef = doc(db, 'clients', user.uid, 'claimedOffers', offer.id);
    await setDoc(offerRef, { 
      ...offer, 
      claimedAt: new Date() 
    });

    // 4. Update UI immediately
    claimedOfferIds.value.add(offer.id);
    
    // In a real app, you'd show a success toast here
    console.log("Offer claimed!", offer.title);

  } catch (error) {
    console.error("Error claiming offer: ", error);
    // In a real app, you'd show an error toast here
  } finally {
    isClaiming.value = null; // Remove loading state
  }
};

// --- Lifecycle Hook ---
onMounted(() => {
  fetchOffers(); // Fetch all public offers

  // Listen for auth changes to fetch user-specific data
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userId.value = user.uid;
      fetchClaimedOffers(user.uid); // Fetch user's claimed offers
    } else {
      // User logged out
      userId.value = null;
      claimedOfferIds.value = new Set(); // Clear claimed offers
    }
  });
});
</script>

<style scoped>
/* Scoped styles remain the same */
</style>

