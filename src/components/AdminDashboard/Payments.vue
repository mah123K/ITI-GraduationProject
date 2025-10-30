<template>
 <div class="bg-white shadow-lg rounded-2xl p-6">
 
   <!-- Section Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-[#5984C6]">Payment Management</h2>
      <p class="text-gray-600">Track all transactions and payments</p>
    </div>


    <div class="flex justify-between items-center mb-4 px-4">
      <h3 class="text-xl font-semibold text-gray-800">All Transactions</h3>

      <div class="flex items-center gap-3">
        <!-- Search Input (smaller) -->
        <div class="relative w-60">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            class="w-full py-2 pl-9 pr-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5984C6]"
          />
          <i class="bi bi-search absolute left-3 top-2.5 text-gray-500 text-sm"></i>
        </div>

        <!-- Filter Dropdown -->
        <div class="relative">
          <button
            @click="toggleFilter"
            class="flex items-center gap-2 bg-[#1E293B] text-white px-4 py-2 rounded-lg hover:bg-[#334155] transition text-sm"
          >
            <i class="bi bi-funnel"></i>
            Filter
          </button>

          <!-- Filter Menu -->
          <div
            v-if="showFilter"
            class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
          >
            <ul>
              <li
                v-for="option in statusOptions"
                :key="option"
                @click="filterStatus = option; showFilter = false"
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {{ option }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <table class="min-w-full text-sm text-gray-700">
      <thead class="bg-[#5984C6] text-white">
        <tr>
          <th class="py-3 px-4 text-left">Payment ID</th>
          <th class="py-3 px-4 text-left">Customer</th>
          <th class="py-3 px-4 text-left">Order ID</th>
          <th class="py-3 px-4 text-left">Amount</th>
      
          <th class="py-3 px-4 text-left">Date</th>
          <th class="py-3 px-4 text-left">Status</th>
          <th class="py-3 px-4 text-left">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="payment in filteredPayments"
          :key="payment.id"
           class="border-t hover:bg-[#f3f9fc] transition"
        >
          <td class="py-3 px-4">{{ payment.id }}</td>
          <td class="py-3 px-4">{{ payment.customer }}</td>
          <td class="py-3 px-4">{{ payment.orderId }}</td>
          <td class="py-3 px-4 font-semibold">{{ payment.amount }}EGP</td>
         
          <td class="py-3 px-4">
            <div class="flex flex-col">
              <span class="text-gray-700 font-medium">{{ payment.date }}</span>
              <span class="text-gray-500 text-xs">{{ payment.time }}</span>
            </div>
          </td>
          <td class="py-3 px-4">
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-semibold',
                payment.status === 'completed'
                  ? 'bg-green-100 text-green-700'
                  : payment.status === 'unconfirmed'
                  ? 'bg-amber-100 text-amber-700'
                  : payment.status === 'upcoming'
                  ? 'bg-sky-100 text-sky-700'
                  : payment.status === 'new'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-rose-100 text-rose-700',
              ]"
            >
              {{ payment.status }}
            </span>
          </td>

          <td class="py-3 px-4 flex space-x-2">
            <button
              @click="openModal('view', payment)"
              class="p-2 rounded-lg text-blue-500 hover:bg-blue-100 transition"
            >
              <i class="bi bi-eye"></i>
            </button>

            <div class="h-3 border-l border-gray-300 mt-3"></div>

            <button
              @click="openModal('edit', payment)"
              class="p-2 rounded-lg text-yellow-500 hover:bg-yellow-100 transition"
            >
              <i class="bi bi-pencil"></i>
            </button>

            <div class="h-3 border-l border-gray-300 mt-3"></div>

            <button
              @click="openModal('delete', payment)"
              class="p-2 rounded-lg text-red-500 hover:bg-red-100 transition"
            >
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
    >
      <div class="bg-white w-96 rounded-xl shadow-xl p-6 relative">
        <!-- Close button -->
        <button
          @click="closeModal"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <i class="bi bi-x-lg"></i>
        </button>

        <!-- Dynamic Modal Title -->
        <h3 class="text-lg font-semibold text-[#5984C6] mb-4">
          {{ modalType === 'view' ? 'View Payment' : modalType === 'edit' ? 'Edit Payment' : 'Delete Confirmation' }}
        </h3>

        <!-- View / Edit Form -->
        <div v-if="modalType !== 'delete'" class="space-y-3">
          <div>
            <label class="text-sm font-medium text-gray-600">Customer</label>
            <input
              v-model="selectedPayment.customer"
              :readonly="modalType === 'view'"
              class="w-full p-2 border rounded-lg text-sm"
            />
          </div>

          <div>
            <label class="text-sm font-medium text-gray-600">Order ID</label>
            <input
              v-model="selectedPayment.orderId"
              :readonly="modalType === 'view'"
              class="w-full p-2 border rounded-lg text-sm"
            />
          </div>

          <div>
            <label class="text-sm font-medium text-gray-600">Amount</label>
            <input
              v-model="selectedPayment.amount"
              :readonly="modalType === 'view'"
              class="w-full p-2 border rounded-lg text-sm"
            />
          </div>

          <div>
            <label class="text-sm font-medium text-gray-600">Status</label>
            <select
              v-model="selectedPayment.status"
              :disabled="modalType === 'view'"
              class="w-full p-2 border rounded-lg text-sm bg-white"
            >
              <option v-for="status in statusOptions" :key="status" :value="status.toLowerCase()">
                {{ status }}
              </option>
            </select>
          </div>

          <div class="flex justify-end mt-4" v-if="modalType === 'edit'">
            <button
              @click="saveChanges"
              class="bg-[#5984C6] text-white px-4 py-2 rounded-lg hover:bg-[#4369a4] transition text-sm"
            >
              Save Changes
            </button>
          </div>
        </div>

        <!-- Delete Confirmation -->
        <div v-else class="text-center">
          <p class="text-gray-600 mb-4">Are you sure you want to delete this payment?</p>
          <div class="flex justify-center gap-3">
            <button
              @click="confirmDelete"
              class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm"
            >
              Delete
            </button>
            <button
              @click="closeModal"
              class="bg-gray-200 px-4 py-2 rounded-lg text-sm hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../../firebase/firebase.js';
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
} from 'firebase/firestore';

export default {
  data() {
    return {
      payments: [],
      loading: false,
      unsubscribeOrders: null,
      showModal: false,
      modalType: '',
      selectedPayment: {},
      // search & filter state (like Orders.vue)
      searchQuery: '',
      filterStatus: 'All',
      showFilter: false,
      statusOptions: ['Completed', 'Pending', 'Failed', 'Refunded', 'Processing'],
    };
  },
  created() {
    // Listen to Firestore `orders` collection in real-time.
    this.loading = true;
    const ordersCol = collection(db, 'orders');
    this.unsubscribeOrders = onSnapshot(
      ordersCol,
      (snapshot) => {
        const orders = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        // Map orders -> payments (preserve order status and normalize to lowercase)
        this.payments = orders.map((o) => {
          const rawStatus = o.status || 'new';
          return {
            id: `PAY-${String(o.id).padStart(3, '0')}`,
            customer: o.customer || 'Unknown',
            orderId: `ORD-${String(o.id).padStart(3, '0')}`,
            amount: o.price ?? o.amount ?? 0,
            method: o.paymentMethod || 'Cash',
            date: o.appointmentDate?.toDate().toLocaleDateString() || '',
            time: o.appointmentDate?.toDate().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            }) || '',
            status: rawStatus.toString().toLowerCase(),
          };
        });

        // Sync derived payments to `payments` collection (non-blocking)
        this.syncPaymentsToFirestore();
        this.loading = false;
      },
      (err) => {
        // eslint-disable-next-line no-console
        console.error('orders onSnapshot error', err);
        this.loading = false;
      }
    );
  },
  beforeUnmount() {
    if (this.unsubscribeOrders) this.unsubscribeOrders();
  },
  computed: {
    filteredPayments() {
      return this.payments.filter((payment) => {
        const q = this.searchQuery.toString().toLowerCase();
        const matchesSearch =
          (payment.customer || '').toString().toLowerCase().includes(q) ||
          (payment.orderId || '').toString().toLowerCase().includes(q) ||
          (payment.method || '').toString().toLowerCase().includes(q);

        const matchesStatus =
          this.filterStatus === 'All' || payment.status === this.filterStatus;

        return matchesSearch && matchesStatus;
      });
    },
  },
  methods: {
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },

    // computed-like helper for Options API (we add a real computed below)
    // filteredPayments will be implemented as a computed property via patch
    async syncPaymentsToFirestore() {
      try {
        for (const p of this.payments) {
          // idempotent write
          await setDoc(doc(db, 'payments', p.id), p, { merge: true });
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to sync payments to Firestore', err);
      }
    },

    viewPayment(payment) {
      alert(
        `Payment ${payment.id}\nCustomer: ${payment.customer}\nOrder: ${payment.orderId}\nAmount: $${payment.amount}\nStatus: ${payment.status}`
      );
    },

    async editPayment(payment) {
      const newStatus = prompt(
        `Set status for ${payment.id} (Completed / Pending / Failed):`,
        payment.status
      );
      if (!newStatus) return;
      payment.status = newStatus;
      try {
        await setDoc(doc(db, 'payments', payment.id), payment, { merge: true });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to update payment', err);
      }
    },

    async deletePayment(payment) {
      if (!confirm(`Delete payment ${payment.id}? This cannot be undone.`)) return;
      this.payments = this.payments.filter((p) => p.id !== payment.id);
      try {
        await deleteDoc(doc(db, 'payments', payment.id));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to delete payment from Firestore', err);
      }
    },
    openModal(type, payment) {
      this.modalType = type;
      this.selectedPayment = { ...payment };
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
    },

    async saveChanges() {
      try {
        // persist to payments collection
        await setDoc(doc(db, 'payments', this.selectedPayment.id), this.selectedPayment, { merge: true });

        // update local list
        const idx = this.payments.findIndex((p) => p.id === this.selectedPayment.id);
        if (idx !== -1) {
          this.payments[idx] = { ...this.selectedPayment };
        }

        this.closeModal();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to save payment changes', err);
      }
    },

    async confirmDelete() {
      try {
        await deleteDoc(doc(db, 'payments', this.selectedPayment.id));
        this.payments = this.payments.filter((p) => p.id !== this.selectedPayment.id);
        this.closeModal();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to delete payment', err);
      }
    },
  },
};
</script>
