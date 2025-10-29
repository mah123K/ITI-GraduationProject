<template>
  <div class="min-h-screen bg-[#f5f8fc] flex flex-col items-center py-10 px-4">
    <div class="bg-white rounded-2xl shadow-lg w-full max-w-lg p-8 text-center">
      <h2 class="text-2xl font-bold text-[#133B5D] mb-4">Confirm Your Payment</h2>

      <div class="border border-gray-200 rounded-lg p-4 mb-6 text-left bg-gray-50">
        <p><strong>Service:</strong> {{ serviceTitle }}</p>
        <p><strong>Technician:</strong> {{ technicianName }}</p>
        <p><strong>Total:</strong> {{ amount }} EGP</p>
      </div>

      <p class="text-gray-600 mb-4">Please enter your card details below to complete the payment:</p>

      <iframe
        v-if="iframeUrl"
        :src="iframeUrl"
        frameborder="0"
        class="w-full h-[550px] rounded-xl shadow-inner"
      ></iframe>

      <p v-else class="text-gray-500 mt-6">Loading payment form...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { db } from '../firebase/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const route = useRoute();
const router = useRouter();
const auth = getAuth();
const iframeUrl = ref("");
const serviceTitle = ref("");
const technicianName = ref("");
const amount = ref("");
const orderId = ref("");

// Function to save payment to Firebase
const savePaymentToFirebase = async (paymentDetails) => {
  try {
    const paymentData = {
      customer: auth.currentUser?.displayName || 'Anonymous',
      customerId: auth.currentUser?.uid,
      orderId: paymentDetails.orderId,
      amount: Number(paymentDetails.amount),
      method: 'Credit Card', // Or dynamic based on payment method
      date: serverTimestamp(),
      status: 'Completed',
      serviceTitle: paymentDetails.serviceTitle,
      technicianName: paymentDetails.technicianName
    };

    const docRef = await addDoc(collection(db, 'payments'), paymentData);
    console.log('Payment saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving payment:', error);
    throw error;
  }
};

// Function to handle successful payment
const handlePaymentSuccess = async () => {
  try {
    await savePaymentToFirebase({
      orderId: orderId.value,
      amount: amount.value,
      serviceTitle: serviceTitle.value,
      technicianName: technicianName.value
    });
    if (orderId.value) {
      try {
        const orderRef = doc(db, 'orders', orderId.value);
        await updateDoc(orderRef, { status: 'upcoming' });
      } catch (e) {
        console.error('Failed to update order status after payment:', e);
      }
    }
    router.push('/payment-success');
  } catch (error) {
    console.error('Error handling payment success:', error);
    router.push('/payment-failed');
  }
};

// Function to handle payment failure
const handlePaymentFailure = () => {
  router.push('/payment-failed');
};

onMounted(async () => {
  const { id, price, service, technician } = route.query;

  orderId.value = id;
  serviceTitle.value = service;
  technicianName.value = technician;
  amount.value = price;

  try {
    const response = await fetch("http://localhost:5000/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: price,
        orderId: id,
        serviceTitle: service,
        technicianName: technician,
      }),
    });

    const data = await response.json();
    iframeUrl.value = data.url;

    // Listen for payment status messages from the iframe
    window.addEventListener('message', (event) => {
      // Verify the origin of the message for security
      if (event.origin === 'http://localhost:5000') {
        if (event.data.status === 'success') {
          handlePaymentSuccess();
        } else if (event.data.status === 'failure') {
          handlePaymentFailure();
        }
      }
    });
  } catch (error) {
    console.error('Error initializing payment:', error);
    router.push('/payment-failed');
  }
});
</script>
